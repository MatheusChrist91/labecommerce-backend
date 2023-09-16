import { TUser, TProduct } from './types'

// FUNÇÕES PARA CRIAR NOVOS USUÁRIOS E PARA RETORNAR O ARRAY DE USUÁRIOS

const createUser = (id:string, name:string, email:string, password:string, createdAt: string):{} => {
    const newUser:TUser = {
        id, 
        name,
        email,
        password,
        createdAt:new Date().toISOString()
    }

    users.push(newUser);

    return newUser;
}

const getAllUsers = (): TUser[] => {
    return users;
}


export const users: TUser[] = [

    {
        id: 'u001',
        name: 'Fulano',
        email: 'fulano@email.com',
        password: 'fulano123',
        createdAt: new Date().toISOString()
    },    
    {
        id: 'u002',
        name: 'Beltrana',
        email: 'beltrana@email.com',
        password: 'beltrana00',
        createdAt: new Date().toISOString()
    },    
    {
        id: 'u003',
        name: 'Ciclano',
        email: 'ciclano@email.com',
        password: 'Ciclano456',
        createdAt: new Date().toISOString()
    },    

]

// FUNÇÕES PARA CRIAR UM NOVO PRODUTO E PARA RETORNAR O ARRAY DE PRODUTOS

const createProduct = (id:string, name:string, price:number, description:string, imageUrl:string):{} => {
    const newProduct:TProduct = {
        id,
        name, 
        price, 
        description, 
        imageUrl 
    }

    products.push(newProduct);

    return newProduct;
}

const getAllProducts = () => {
    return products;
}

export const products: TProduct[] = [

    {
        id: 'prod001',
        name: 'Mouse gamer',
        price: 250,
        description: 'Melhor mouse do mercado',
        imageUrl: 'https://picsum.photos/seed/Mouse%20gamer/400',
    },
    {
        id: 'prod002',
        name: 'Monitor',
        price: 900,
        description: 'Monitor LED Full HD 24 polegadas',
        imageUrl: 'https://picsum.photos/seed/Monitor/400',
    },

] 

// FUNÇÕES QUE BUSCAM USUÁRIO OU PRODUTO 

const searchProductsByName = (name:string): TProduct[] => {
    return products.filter((product) => product.name === name)
}