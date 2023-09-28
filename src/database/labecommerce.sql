-- Active: 1695689645650@@127.0.0.1@3306

PRAGMA foreign_keys = ON;

PRAGMA date_class = 'datetime';

-- Criação da tabela users

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- Selecionar tabela users

SELECT * FROM users;

-- Deleta a tabela users
DROP TABLE "users";

-- Deleta um usuário pelo ID --
DELETE from users
WHERE id = 'u004';

-- Criação da tabela products
CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        imageUrl TEXT NOT NULL
    );

-- Seleciona tabela products
SELECT * FROM products;

-- Retorna produtos com um termo --
SELECT * FROM products
WHERE name = 'gamer';


-- Deleta a tabela products
DROP TABLE "products";

-- Deleta um produto pelo id --
DELETE from products
WHERE id = 'prod005';

-- Edita um produto pelo id --
UPDATE products
SET 
name = 'newName',
price = 99999.999,
description = 'newDescription',
imageUrl = 'newIage'
WHERE id = 'prod006';


PRAGMA table_info(users);

PRAGMA table_info(products);

-- Criando três usuários novos --

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES
(
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
            '%Y-%m-%d %H:%M:%S',
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
    ),(
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

-- Criando cinco produtos novos --

INSERT INTO products (id, name, price, description, imageUrl)
VALUES
(
        'prod004',
        'Echo Dot 5ª geração Amazon',
        359.99,
        'Escuta tudo',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ),(
        'prod005',
        'Teclado Mecânico Gamer HyperX',
        429.99,
        'Nem o Frank Aguiar tem um assim',
        'https://picsum.photos/seed/Monitor/400'
    ),(
        'prod006',
        'Apple Watch S8',
        5849.10,
        'Prefiro gastar na RTX 4090Ti, pelo menos roda tudo',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ),(
        'prod007',
        'SSD 1TB Kingston KC3000',
        549.99,
        'Prova de que o dinheiro compra tempo',
        'https://picsum.photos/seed/Monitor/400'
    ),(
        'prod008',
        'Placa de vídeo RTX 4090Ti',
        18.999,
        'Roda tudo',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ),(
        'prod009',
        'Notebook gamer',
        15699.99,
        'Esquenta demais',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    );


