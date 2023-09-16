import express, { Request, Response } from "express";
import cors from "cors";
import { TUser, TProduct } from "./types";
import { users, products } from "./database";

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
app.get("/users", (req: Request, res: Response) => {
  const getAllUsers: TUser[] = users;

  res.status(200).send(getAllUsers);
});

// BUSCA POR PRODUTO
app.get("/products", (req: Request, res: Response) => {
  const gap: string = req.query.gap as string;

  if (gap) {
    const getAllProducts: TProduct[] = products.filter(
      (product) => product.name.toLowerCase() === gap.toLowerCase()
    );

    res.status(200).send(getAllProducts);
  } else {
    res.status(200).send(products);
  }
});

// CRIAR NOVO USUÁRIO
app.post("/users", (req: Request, res: Response) => {
  const { id, name, email, password, createdAt }: TUser = req.body;

  const newUser: TUser = {
    id,
    name,
    email,
    password,
    createdAt
  }

  users.push(newUser);

  res.status(201).send("Cadastro realizado com sucesso!");
})

// CRIAR NOVO PRODUTO
app.post("/products", (req: Request, res: Response) => {
  const { id, name, price, description, imageUrl }: TProduct = req.body;

  const newProduct: TProduct = {
    id,
    name,
    price,
    description,
    imageUrl
  }

  products.push(newProduct);

  res.status(201).send("Produto cadastrado com sucesso!");
})
// lala