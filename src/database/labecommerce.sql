-- Active: 1695689645650@@127.0.0.1@3306

PRAGMA date_class = 'datetime';

-- CRIAÇÃO DA TABELA USERS

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- SELECINAR TABELA USERS

SELECT * FROM users;

-- DELETA A TABELA USERS

DROP TABLE "users";

-- DELETA UM USUÁRIO PELO ID --

DELETE FROM users WHERE id = 'u004';

-- CRIAÇÃO DA TABELA PRODUCTS

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        imageUrl TEXT NOT NULL
    );

-- SELECIONA TABELA PRODUCTS --

SELECT * FROM products;

-- RETORNA UM PRODUTO COM UM QUERY --

SELECT * FROM products WHERE name LIKE '%gamer%';

-- DELETA TABELA PRODUCTS --

DROP TABLE "products";

-- DELETA UM PRODUTO PELO ID --

DELETE from products WHERE id = 'prod005';

-- EDITA UM PRODUTO PELO ID --

UPDATE products
SET
    name = 'newName',
    price = 99999.999,
    description = 'newDescription',
    imageUrl = 'newIage'
WHERE id = 'prod006';

PRAGMA table_info(users);

PRAGMA table_info(products);

-- ADICIONANDO/POPULANDO USUÁRIOS A TABELA USERS --

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u004',
        'spilmaia',
        'spil_maia@email',
        'idkfa',
        strftime(
            '%Y-%m-%d %H:%M:%S',
            'now',
            'localtime'
        )
    ), (
        'u005',
        'farinkinkop',
        'farinkin_kop@email',
        '123qwe',
        strftime(
            '%d-%m-%Y %H:%M:%S',
            'now',
            'localtime'
        )
    ), (
        'u006',
        'jamelão',
        'jame_lão@email',
        'qwe123',
        strftime(
            '%Y-%m-%d %H:%M:%S',
            'now',
            'localtime'
        )
    ), (
        'u007',
        'Mr Splinter',
        'splinter_mr@email',
        'tartaruga',
        strftime(
            '%Y-%m-%d %H:%M:%S',
            'now',
            'localtime'
        )
    );

-- ADICIONANDO/POPULANDO A TABELA PRODUCTS --

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        imageUrl
    )
VALUES (
        'prod004',
        'Echo Dot 5ª geração Amazon',
        359.99,
        'Escuta tudo e não responde nada.',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'prod005',
        'Teclado Mecânico Gamer HyperX',
        429.99,
        'Nem o Frank Aguiar tem um assim.',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod006',
        'Placa de vídeo RTX 4090Ti',
        18.999,
        'Roda tudo.',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'prod007',
        'Apple Watch S8',
        5849.10,
        'Prefiro gastar na RTX 4090Ti, pelo menos roda tudo.',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'prod008',
        'SSD 1TB Kingston KC3000',
        549.99,
        'Prova de que o dinheiro compra tempo.',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod009',
        'Notebook Gamer',
        15699.99,
        'Compra um desk porque notebook esquenta demais.',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    );

-- CRIAÇÃO DA TABELA DE PEDIDOS --

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer_id TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at DATETIME DEFAULT (
            strftime(
                '%Y-%m-%d %H:%M:%S',
                'now',
                'localtime'
            )
        ),
        FOREIGN KEY (buyer_id) REFERENCES users(id)
    );
    -- SELECINA A TABELA PURCHASES --
    SELECT * FROM purchases

-- DELETA A TABELA PURCHASES --
DROP TABLE purchases;

-- POPULA A TABELA PURCHASES --
INSERT INTO
    purchases (id, buyer_id, total_price)
VALUES ('pedido01', 'u004', 250.00), ('pedido02', 'u006', 80000);

-- EDITAR O VALOR TOTAL DA COMPRA --

UPDATE purchases SET total_price = 150 WHERE id = 'pedido01';

UPDATE purchases SET total_price = 50000 WHERE id = 'pedido02';

-- QUERY QUE CONSULTA UTILIZANDO JUNÇÃO PARA SIMULAR UM ENDPOINT DE INFORMAÇÕES DE UMA COMPRA ESPECÍFICA --

SELECT
    purchases.id AS purchase_id,
    users.id AS user_id,
    users.name AS user_name,
    users.email as user_email,
    purchases.total_price,
    purchases.created_at
FROM purchases
INNER JOIN users ON purchases.buyer_id = users.id;
