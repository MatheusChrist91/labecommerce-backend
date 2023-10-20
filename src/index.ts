import express, { Request, Response } from "express";
import cors from "cors";
import { TUser, TProduct } from "./types";
/* import { users, products } from "./database";
import { throws } from "assert"; */
import { db } from "./database/knex";

const app = express();

app.use(express.json());

app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

// BUSCA POR TODOS OS USUÁRIOS
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await db.select("*").from("users");

    if (users.length === 0) {
      throw new Error("Nenhum usuário foi encontrado!");
    }

    res.status(200).send(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    }
  }
});

// BUSCA POR PRODUTO
app.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await db.select("*").from("products");

    res.status(200).send(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    } else {
      res
        .status(500)
        .send({ error: "Ocorreu um erro na solicitação de produtos!" });
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
    const { id, name, email, password}: TUser = req.body;

    const [userId] = await db.raw(
      `
    SELECT id
    FROM users
    WHERE id = ?;
    `,
      [id]
    );

    if (userId && userId.length > 0) {
      res.statusCode = 400;
      throw new Error("Este 'id' já existe em nosso banco de dados");
    }

    const [existingEmail] = await db.raw(
      `
    SELECT email
    FROM users
    WHERE email = ?;
    `,
      [email]
    );

    if (existingEmail && existingEmail.length > 0) {
      res.statusCode = 400;
      throw new Error("Este 'e-mail' já existe em nosso banco de dados");
    }

    await db.raw(
      `
      INSERT INTO users (id, name, email, password)
      VALUES (?, ?, ?, ?);
    `,
      [id, name, email, password]
    );

    res.status(201).send("Cadastro realizado com sucesso!");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// CRIAR NOVO PRODUTO
app.post("/products", async (req: Request, res: Response) => {
  try {
    const { id, name, price, description, imageUrl }: TProduct = req.body;

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

    await db.raw(`
      INSERT INTO products (id, name, price, description, imageUrl)
      VALUES ("${id}", "${name}", "${price}", "${description}", "${imageUrl}")`);

    res.status(201).send("Produto cadastrado com sucesso!");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

// DELETA UM USUÁRIO A PARTIR DO ID PASSADO EM PATH VARIABLES
app.delete("/user/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const user = await db("users").where("id", id).first();

    if (!user) {
      res.status(400).send("Usuário não encontrado!");
      return;
    }

    await db("users").where("id", id).del();

    res.status(200).send("O usuário foi deletado com sucesso");
  } catch (error: any) {
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

    if (product && product.length === 0) {
      res.statusCode = 404;
      throw new Error("Produto não encontrado!");
    }

    if (name && name?.length === 0) {
      res.statusCode = 400;
      throw new Error("O nome deve ter no mínimo 1 caractere!");
    }
    if (typeof price === "number" && price < 0 && price !== undefined) {
      res.statusCode = 400;
      throw new Error("O preço deve ser um número e deve ser maior que 0!");
    }

    if (description && description.length === 0) {
      res.statusCode = 400;
      throw new Error("A descrição deve conter ao menos 1 caractere!");
    }
    if (typeof imageUrl !== "string") {
      res.statusCode = 400;
      throw new Error("A URL do produto deve ser um texto!");
    }

    const [newProduct] = await db.raw(
      `SELECT * FROM products WHERE id = "${id}"`
    );

    if (newProduct) {
      await db.raw(`
      UPDATE products SET
      name = "${name || newProduct.name}",
      price = "${price || newProduct.price}",
      description = "${description || newProduct.description}",
      imageUrl = "${imageUrl || newProduct.imageUrl}"
      WHERE id = "${id}"
      `);
    }

    res.status(200).send({ message: "Produto atualizado com sucesso!" });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// CADASTRA UM NOVO PEDIDO
app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, buyer_id, total_price } = req.body;

    if (typeof id !== "string" || id.length < 4) {
      res.statusCode = 404;
      throw new Error('O campo "id" é obrigatório!');
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

    res.status(200).send("Produto cadastrado com sucesso!");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// RETORNA OS DADOS DE UMA COMPRA, INCLUINDO A LISTA DE PRODUTOS DA MESMA
app.get('/purchases/:id', async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id as string;

    const [purchaseId] = await db.raw(
      'SELECT * FROM purchases WHERE id = ?',
      [id]
    );

    if (!purchaseId || purchaseId.length === 0) {
      throw new Error(
        'Nenhuma compra foi encontrada com este "id"!'
      );
    }

    const userDataBuyer = await db.raw(`
      SELECT
        purchases.id AS purchaseId,
        purchases.buyer_id AS buyerId,
        users.name AS buyerName,
        users.email AS buyerEmail,
        purchases.total_price AS totalPrice,
        purchases.created_at AS createdAt
      FROM purchases
      INNER JOIN users ON purchases.buyer_id = users.id
      WHERE purchases.id = ?
    `, [id]);

    const products = await db.raw(`
      SELECT
        purchases_products.product_id AS id,
        products.name,
        products.price,
        products.description,
        products.imageUrl,
        purchases_products.quantity
      FROM purchases_products
      INNER JOIN products ON products.id = purchases_products.product_id
      WHERE purchases_products.purchase_id = ?
    `, [id]);

    const result = {
      ...userDataBuyer[0][0],
      products: products[0],
    };

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    if (req.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send('Erro inesperado');
    }
  }
});

// DELETA UM PEDIDO EXISTENTE
app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Verifica se a compra existe
    const purchase = await db("purchases").where("id", id).first();

    if (!purchase) {
      res.status(404).send({ error: 'Compra não encontrada!' });
      return;
    }

    // Exclui a compra
    await db("purchases").where("id", id).del();

    res.status(200).send({ message: 'A compra foi excluída com sucesso!' });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});