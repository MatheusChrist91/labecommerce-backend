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
  } catch (error) {
    if (error instanceof Error) {      
      res.send(error.message);
    }
  }
});

// BUSCA POR PRODUTO
app.get("/products", async (req: Request, res: Response) => {
  try {
    /* const result: TProduct[] = products; */
    const products: TProduct[] = await db.raw(`SELECT * FROM products`);

    res.status(200).send(products);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Ocorreu um erro na solicitação de produtos!");
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
      res.send("Ocorreu um erro na solicitação.");
    }
  }
});

// CRIAR NOVO USUÁRIO
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, name, email, password, createdAt }: TUser = req.body;

    /* const existingId = users.find((user) => user.id === id);
    if (existingId) {
      res.statusCode = 400;
      throw new Error("Este 'id' já existe em nosso banco de dados");
    } */

    const [userId] = await db.raw(
      `
    SELECT id
    FROM users
    WHERE id = ?;
    `,
      [id]
    );

    if (userId.length > 0) {
      res.statusCode = 400;
      throw new Error("Este 'id' já existe em nosso banco de dados");
    }

    /* const existingEmail = users.find((user) => user.email === email);
    if (existingEmail) {
      res.statusCode = 400;
      throw new Error("Este 'e-mail' já existe em nosso banco de dados");
    } */

    const [existingEmail] = await db.raw(
      `
    SELECT email
    FROM users
    WHERE email = ?;
    `,
      [email]
    );

    if (existingEmail.length > 0) {
      res.statusCode = 400;
      throw new Error("Este 'e-mail' já existe em nosso banco de dados");
    }

    /* const newUser: TUser = {
      id,
      name,
      email,
      password,
      createdAt,
    };

    users.push(newUser); */

    await db.raw(
      `
      INSERT INTO users (id, name, email, password, createdAt)
      VALUES (?, ?, ?, ?, ?);
    `,
      [id, name, email, password, createdAt]
    );

    res.status(201).send("Cadastro realizado com sucesso!");
  } catch (error) {
    if(error instanceof Error){
      res.send(error.message);
    }    
  }
});

// CRIAR NOVO PRODUTO
app.post("/products", async (req: Request, res: Response) => {
  try {
    const { id, name, price, description, imageUrl }: TProduct = req.body;

    /* const existingId = products.find((product) => product.id === id);
    if (existingId) {
      throw new Error(
        "Este 'id' deste produto já existe em nosso banco de dados"
      );
    } */

    const [productId] = await db.raw(
      `
      SELECT id
      FROM products
      WHERE id = ?;
    `,
      [id]
    );

    if (productId > 0) {
      res.statusCode = 400;
      throw new Error('Este "id" já existe em nosso banco de dados!');
    }

    /* const newProduct: TProduct = {
      id,
      name,
      price,
      description,
      imageUrl,
    };

    products.push(newProduct); */

    await db.raw(`
      INSERT INTO products (id, name, price, description, imageUrl)
      VALUES ("${id}", "${name}", "${price}", "${description}", "${imageUrl}")`);

    res.status(201).send("Produto cadastrado com sucesso!");
  } catch (error: any) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

// DELETA UM USUÁRIO A PARTIR DO ID PASSADO EM PATH VARIABLES

app.delete("/user/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [userId] = await db.raw("SELECT * FROM users WHERE id = ?", [id]);

    if (userId.length === 0) {
      res.statusCode = 400;
      throw new Error("Usuário não encontrado!");
    }

    await db.raw("DELETE FROM users WHERE id = ?", [id]);

    res.status(200).send("O usuário foi deletado com sucesso");
  } catch (error: any) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// DELETA UM PRODUTO A PARTIR DO ID PASSADO EM PATH VARIABLES
app.delete("/product/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [product] = await db.raw("SELECT * FROM products WHERE id = ?", [id]);

    if (product.length === 0) {
      res.statusCode = 400;
      throw new Error(
        'O "id" deste produto não foi encontrado em nosso banco de dados!'
      );
    }

    await db.raw("DELETE FROM products WHERE id = ?", [id]);

    res.status(200).send({ message: "O produto foi deletado com sucesso!" });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// EDITA UM PRODUTO BASEADO NO ID DO PRODUTO
app.put("/product/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, price, description, imageUrl }: TProduct = req.body;

    const [product] = await db.raw("SELECT * FROM products WHERE id = ?", [id]);

    if (product.length === 0) {
      res.statusCode = 404;
      throw new Error("Produto não encontrado!");
    }    

    if (name?.length === 0) {
      res.statusCode = 400;
      throw new Error("O nome deve ter no mínimo 1 caractere!");
    }
    if (typeof price === "number" && price < 0 && price !== undefined) {
      res.statusCode = 400;
      throw new Error("O preço deve ser um número e deve ser maior que 0!");
    }

    if (description.length === 0) {
      res.statusCode = 400;
      throw new Error("A descrição deve conter ao menos 1 caractere!");
    }
    if (typeof imageUrl !== "string") {
      res.statusCode = 400;
      throw new Error("A URL do produto deve ser um texto!");
    }

    const [newProduct] = await db.raw(`SELECT * FROM products WHERE id = "${id}"`)

    if(newProduct){
      await db.raw(`
      UPDATE products SET
      name = "${name || newProduct.name}",
      price = "${price || newProduct.price}",
      description = "${description || newProduct.description}",
      imageUrl = "${imageUrl || newProduct.imageUrl}"
      WHERE id = "${id}"
      `);
    }

    /* if (typeof name !== "string") {
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
    } */

    /* product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.imageUrl = imageUrl || product.imageUrl; */

    res.status(200).send({ message: "Produto atualizado com sucesso!" });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// CADASTRA UM NOVO PEDIDO

app.post("/purchases", async(req: Request, res: Response) => {
  try {
    const {id, buyer_id, total_price} = req.body;

    if(typeof id !== "string" || id.length < 4){
      res.statusCode = 404;
      throw new Error('O campo "id" é obrigatório!')
    }

    if (typeof buyer_id !== "string" || buyer_id.length < 3) {
      res.statusCode = 404;
      throw new Error('O campo do "buyer id" é obrigatório');
    }

    if (typeof total_price !== "number" || total_price <= 1) {
      res.statusCode = 404;
      throw new Error('O campo do "preço" é obrigatório');
    }

    const isPurchase = await db.raw(`INSERT INTO purchases
    (id, buyer_id, total_price)
    VALUES("${id}", "${buyer_id}", "${total_price}")
    `);

    res.status(200).send('Produto cadastrado com sucesso!');
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
})
