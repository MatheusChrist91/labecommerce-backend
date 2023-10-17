import express, { Request, Response } from "express";
import cors from "cors";
import { TUser, TProduct } from "./types";
import { users, products } from "./database";
import { throws } from "assert";
import { db } from "./database/knex";

/* console.log("Hello world!")
console.table(users)
console.table(products) */

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

// BUSCA POR USUÁRIO
app.get("/users", async (req: Request, res: Response) => {
  try {
    /* const getAllUsers: TUser[] = users; */

    const getAllUsers: TUser[] = await db.raw(`SELECT * FROM users`);

    if (getAllUsers.length === 0) {
      throw new Error("Nenhum usuário foi encontrado!");
    }

    res.status(200).send(getAllUsers);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    } else {
      res.send(error.message);
    }
  }
});

// BUSCA POR PRODUTO
app.get("/products", async (req: Request, res: Response) => {
  try {
    /* const result: TProduct[] = products; */
    const result: TProduct[] = await db.raw(`SELECT * FROM products`)

    res.status(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro no produtos");
    }
  }
});

// PROCURANDO PRODUTO POR QUERY

app.get("/products/search", async (req, res) => {
  try {
    const query: string = req.query.q as string;

    if (query.length === 0) {
      res.statusCode = 404;
      throw new Error("Query deve possuir pelo menos um caractere");
    }

    const productsByName: TProduct[] = await db("products").where(
      "name",
      "like",
      `%${query}%`
    );

    if (productsByName.length === 0) {
      res.statusCode = 404;
      throw new Error(`Nenhum produto encontrado para a query "${query}"`);
    }

    res.status(200).send(productsByName);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro: a query deve possuir pelo menos um caractere");
    }
  }
});


// CRIAR NOVO USUÁRIO
app.post("/users", (req: Request, res: Response) => {
  try {
    const { id, name, email, password, createdAt }: TUser = req.body;

    const existingId = users.find((user) => user.id === id);
    if (existingId) {
      res.statusCode = 400;
      throw new Error("Este 'id' já existe em nosso banco de dados");
    }

    const existingEmail = users.find((user) => user.email === email);
    if (existingEmail) {
      res.statusCode = 400;
      throw new Error("Este 'e-mail' já existe em nosso banco de dados");
    }

    const newUser: TUser = {
      id,
      name,
      email,
      password,
      createdAt,
    };

    users.push(newUser);

    res.status(201).send("Cadastro realizado com sucesso!");
  } catch (error: any) {
    console.log(error);
    res.send(error.message);
  }
});

// CRIAR NOVO PRODUTO
app.post("/products", (req: Request, res: Response) => {
  try {
    const { id, name, price, description, imageUrl }: TProduct = req.body;

    const existingId = products.find((product) => product.id === id);
    if (existingId) {
      throw new Error(
        "Este 'id' deste produto já existe em nosso banco de dados"
      );
    }

    const newProduct: TProduct = {
      id,
      name,
      price,
      description,
      imageUrl,
    };

    products.push(newProduct);

    res.status(201).send("Produto cadastrado com sucesso!");
  } catch (error: any) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

// DELETA UM USUÁRIO A PARTIR DO ID PASSADO EM PATH VARIABLES

app.delete("/user/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const indexDelete = users.findIndex((user) => user.id === id);

    if (indexDelete === -1) {
      res.statusCode = 400;
      throw new Error("Usuário não encontrado!");
    }

    if (indexDelete >= 0) {
      users.splice(indexDelete, 1);
      res.status(200).send("Usuário deletado com sucesso!");
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// DELETA UM PRODUTO A PARTIR DO ID PASSADO EM PATH VARIABLES
app.delete("/product/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const indexDelet = products.findIndex((product) => product.id === id);

    if (indexDelet === -1) {
      res.statusCode === 400
      throw new Error("Produto não encontrado!");
    }

    if (indexDelet >= 0) {
      products.splice(indexDelet, 1);
      res.status(200).send("Produto foi deletado!")
    }
    res.status(200).send({ message: "O produto foi deletado com sucesso!" });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// EDITA UM PRODUTO BASEADO NO ID DO PRODUTO
app.put("/product/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = products.find((product) => product.id === id);

    if (!product) {
      res.statusCode = 400;
      throw new Error("Produto não encontrado!");
    }

    const { name, price, description, imageUrl }: TProduct = req.body;

    if (typeof name !== "string") {
      res.statusCode = 400;
      throw new Error("O nome do produto deve ser um texto!");
    }
    if (typeof price !== "number") {
      res.statusCode = 400;
      throw new Error("O preço do produto deve ser um número!");
    }
    if (typeof description !== "string") {
      res.statusCode = 400;
      throw new Error("A descrição do produto deve ser um texto!");
    }
    if (typeof imageUrl !== "string") {
      res.statusCode = 400;
      throw new Error("A URL do produto deve ser um texto!");
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.imageUrl = imageUrl || product.imageUrl;

    res.status(200).send({ message: "Produto atualizado com sucesso!" });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
