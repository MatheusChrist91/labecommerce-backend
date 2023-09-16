"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database");
/* console.log("Hello world!")
console.table(users)
console.table(products) */
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get("/ping", (req, res) => {
    res.send("Pong!");
});
// BUSCA POR USUÁRIO
app.get("/users", (req, res) => {
    const getAllUsers = database_1.users;
    res.status(200).send(getAllUsers);
});
// BUSCA POR PRODUTO
app.get("/products", (req, res) => {
    const gap = req.query.gap;
    if (gap) {
        const getAllProducts = database_1.products.filter((product) => product.name.toLowerCase() === gap.toLowerCase());
        res.status(200).send(getAllProducts);
    }
    else {
        res.status(200).send(database_1.products);
    }
});
// CRIAR NOVO USUÁRIO
app.post("/users", (req, res) => {
    const { id, name, email, password, createdAt } = req.body;
    const newUser = {
        id,
        name,
        email,
        password,
        createdAt
    };
    database_1.users.push(newUser);
    res.status(201).send("Cadastro realizado com sucesso!");
});
// CRIAR NOVO PRODUTO
app.post("/products", (req, res) => {
    const { id, name, price, description, imageUrl } = req.body;
    const newProduct = {
        id,
        name,
        price,
        description,
        imageUrl
    };
    database_1.products.push(newProduct);
    res.status(201).send("Produto cadastrado com sucesso!");
});
