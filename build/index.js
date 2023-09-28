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
    try {
        const getAllUsers = database_1.users;
        if (getAllUsers.length === 0) {
            throw new Error("Nenhum usuário foi encontrado!");
        }
        res.status(200).send(getAllUsers);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        else {
            res.send(error.message);
        }
    }
});
// BUSCA POR PRODUTO
app.get("/products", (req, res) => {
    try {
        const productByName = req.query.productByName;
        if (typeof productByName === "undefined") {
            res.status(200).send(database_1.products);
            return;
        }
        if (typeof productByName === "string" && productByName.length > 2) {
            res.statusCode = 400;
            throw new Error("O nome do produto deve conter ao menos um caractere!");
        }
        const filterProduct = database_1.products.filter((product) => product.name.toLowerCase() === productByName.toLowerCase());
        res.status(200).send(filterProduct);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// PROCURANDO PRODUTO POR QUERY
app.get("/products/search", (req, res) => {
    try {
        const query = req.query.q;
        if (query.length === 0) {
            res.statusCode = 404;
            throw new Error("Query deve possuir pelo menos um caractere");
        }
        const productsByName = database_1.products.filter((product) => product.name.toLowerCase().startsWith(query.toLowerCase()));
        if (productsByName.length === 0) {
            res.statusCode = 404;
            throw new Error(`Nenhum produto encontrado para a query "${query}"`);
        }
        res.status(200).send(productsByName);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro: a query deve possuir pelo menos um caractere");
        }
    }
});
// CRIAR NOVO USUÁRIO
app.post("/users", (req, res) => {
    try {
        const { id, name, email, password, createdAt } = req.body;
        const existingId = database_1.users.find((user) => user.id === id);
        if (existingId) {
            res.statusCode = 400;
            throw new Error("Este 'id' já existe em nosso banco de dados");
        }
        const existingEmail = database_1.users.find((user) => user.email === email);
        if (existingEmail) {
            res.statusCode = 400;
            throw new Error("Este 'e-mail' já existe em nosso banco de dados");
        }
        const newUser = {
            id,
            name,
            email,
            password,
            createdAt,
        };
        database_1.users.push(newUser);
        res.status(201).send("Cadastro realizado com sucesso!");
    }
    catch (error) {
        console.log(error);
        res.send(error.message);
    }
});
// CRIAR NOVO PRODUTO
app.post("/products", (req, res) => {
    try {
        const { id, name, price, description, imageUrl } = req.body;
        const existingId = database_1.products.find((product) => product.id === id);
        if (existingId) {
            throw new Error("Este 'id' deste produto já existe em nosso banco de dados");
        }
        const newProduct = {
            id,
            name,
            price,
            description,
            imageUrl,
        };
        database_1.products.push(newProduct);
        res.status(201).send("Produto cadastrado com sucesso!");
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// DELETA UM USUÁRIO A PARTIR DO ID PASSADO EM PATH VARIABLES
app.delete("/user/:id", (req, res) => {
    try {
        const id = req.params.id;
        const indexDelete = database_1.users.findIndex((user) => user.id === id);
        if (indexDelete === -1) {
            res.statusCode = 400;
            throw new Error("Usuário não encontrado!");
        }
        if (indexDelete >= 0) {
            database_1.users.splice(indexDelete, 1);
            res.status(200).send("Usuário deletado com sucesso!");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});
// DELETA UM PRODUTO A PARTIR DO ID PASSADO EM PATH VARIABLES
app.delete("/product/:id", (req, res) => {
    try {
        const id = req.params.id;
        const indexDelet = database_1.products.findIndex((product) => product.id === id);
        if (indexDelet === -1) {
            res.statusCode === 400;
            throw new Error("Produto não encontrado!");
        }
        if (indexDelet >= 0) {
            database_1.products.splice(indexDelet, 1);
            res.status(200).send("Produto foi deletado!");
        }
        res.status(200).send({ message: "O produto foi deletado com sucesso!" });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
// EDITA UM PRODUTO BASEADO NO ID DO PRODUTO
app.put("/product/:id", (req, res) => {
    try {
        const id = req.params.id;
        const product = database_1.products.find((product) => product.id === id);
        if (!product) {
            res.statusCode = 400;
            throw new Error("Produto não encontrado!");
        }
        const { name, price, description, imageUrl } = req.body;
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
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
