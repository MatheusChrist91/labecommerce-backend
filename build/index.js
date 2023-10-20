"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
/* import { users, products } from "./database";
import { throws } from "assert"; */
const knex_1 = require("./database/knex");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get("/ping", (req, res) => {
    res.send("Pong!");
});
// BUSCA POR TODOS OS USUÁRIOS
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield knex_1.db.select("*").from("users");
        if (users.length === 0) {
            throw new Error("Nenhum usuário foi encontrado!");
        }
        res.status(200).send(users);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: error.message });
        }
    }
}));
// BUSCA POR PRODUTO
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield knex_1.db.select("*").from("products");
        res.status(200).send(products);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: error.message });
        }
        else {
            res
                .status(500)
                .send({ error: "Ocorreu um erro na solicitação de produtos!" });
        }
    }
}));
// PROCURANDO PRODUTO POR QUERY
app.get("/products/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.q;
        if (query.length === 0) {
            res.statusCode = 404;
            throw new Error("Query deve possuir pelo menos um caractere");
        }
        const productsByName = yield (0, knex_1.db)("products").where("name", "like", `%${query}%`);
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
            res.send("Ocorreu um erro na solicitação.");
        }
    }
}));
// CRIAR NOVO USUÁRIO
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, email, password } = req.body;
        const [userId] = yield knex_1.db.raw(`
    SELECT id
    FROM users
    WHERE id = ?;
    `, [id]);
        if (userId && userId.length > 0) {
            res.statusCode = 400;
            throw new Error("Este 'id' já existe em nosso banco de dados");
        }
        const [existingEmail] = yield knex_1.db.raw(`
    SELECT email
    FROM users
    WHERE email = ?;
    `, [email]);
        if (existingEmail && existingEmail.length > 0) {
            res.statusCode = 400;
            throw new Error("Este 'e-mail' já existe em nosso banco de dados");
        }
        yield knex_1.db.raw(`
      INSERT INTO users (id, name, email, password)
      VALUES (?, ?, ?, ?);
    `, [id, name, email, password]);
        res.status(201).send("Cadastro realizado com sucesso!");
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
}));
// CRIAR NOVO PRODUTO
app.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, price, description, imageUrl } = req.body;
        const [productId] = yield knex_1.db.raw(`
      SELECT id
      FROM products
      WHERE id = ?;
    `, [id]);
        if (productId > 0) {
            res.statusCode = 400;
            throw new Error('Este "id" já existe em nosso banco de dados!');
        }
        yield knex_1.db.raw(`
      INSERT INTO products (id, name, price, description, imageUrl)
      VALUES ("${id}", "${name}", "${price}", "${description}", "${imageUrl}")`);
        res.status(201).send("Produto cadastrado com sucesso!");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
// DELETA UM USUÁRIO A PARTIR DO ID PASSADO EM PATH VARIABLES
app.delete("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield (0, knex_1.db)("users").where("id", id).first();
        if (!user) {
            res.status(400).send("Usuário não encontrado!");
            return;
        }
        yield (0, knex_1.db)("users").where("id", id).del();
        res.status(200).send("O usuário foi deletado com sucesso");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
// DELETA UM PRODUTO A PARTIR DO ID PASSADO EM PATH VARIABLES
app.delete("/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const [product] = yield knex_1.db.raw("SELECT * FROM products WHERE id = ?", [id]);
        if (product.length === 0) {
            res.statusCode = 400;
            throw new Error('O "id" deste produto não foi encontrado em nosso banco de dados!');
        }
        yield knex_1.db.raw("DELETE FROM products WHERE id = ?", [id]);
        res.status(200).send({ message: "O produto foi deletado com sucesso!" });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
// EDITA UM PRODUTO BASEADO NO ID DO PRODUTO
app.put("/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { name, price, description, imageUrl } = req.body;
        const [product] = yield knex_1.db.raw("SELECT * FROM products WHERE id = ?", [id]);
        if (product && product.length === 0) {
            res.statusCode = 404;
            throw new Error("Produto não encontrado!");
        }
        if (name && (name === null || name === void 0 ? void 0 : name.length) === 0) {
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
        const [newProduct] = yield knex_1.db.raw(`SELECT * FROM products WHERE id = "${id}"`);
        if (newProduct) {
            yield knex_1.db.raw(`
      UPDATE products SET
      name = "${name || newProduct.name}",
      price = "${price || newProduct.price}",
      description = "${description || newProduct.description}",
      imageUrl = "${imageUrl || newProduct.imageUrl}"
      WHERE id = "${id}"
      `);
        }
        res.status(200).send({ message: "Produto atualizado com sucesso!" });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
// CADASTRA UM NOVO PEDIDO
app.post("/purchases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const isPurchase = yield knex_1.db.raw(`INSERT INTO purchases
    (id, buyer_id, total_price)
    VALUES("${id}", "${buyer_id}", "${total_price}")
    `);
        res.status(200).send("Produto cadastrado com sucesso!");
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
}));
// RETORNA OS DADOS DE UMA COMPRA, INCLUINDO A LISTA DE PRODUTOS DA MESMA
app.get('/purchases/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const [purchaseId] = yield knex_1.db.raw('SELECT * FROM purchases WHERE id = ?', [id]);
        if (!purchaseId || purchaseId.length === 0) {
            throw new Error('Nenhuma compra foi encontrada com este "id"!');
        }
        const userDataBuyer = yield knex_1.db.raw(`
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
        const products = yield knex_1.db.raw(`
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
        const result = Object.assign(Object.assign({}, userDataBuyer[0][0]), { products: products[0] });
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send('Erro inesperado');
        }
    }
}));
// DELETA UM PEDIDO EXISTENTE
app.delete("/purchases/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Verifica se a compra existe
        const purchase = yield (0, knex_1.db)("purchases").where("id", id).first();
        if (!purchase) {
            res.status(404).send({ error: 'Compra não encontrada!' });
            return;
        }
        // Exclui a compra
        yield (0, knex_1.db)("purchases").where("id", id).del();
        res.status(200).send({ message: 'A compra foi excluída com sucesso!' });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
