const { gql } = require('apollo-server-express');

const ProductTypeDefs = gql`
    enum Category {
        Bebidas
        Lacteos
        Carnes
        Frutas
        Verduras
        Panaderia
        Dulces
        Limpieza
        Higiene
        Enlatados
    }

    type Product {
        _id: ID!
        facturapiId: String
        name: String!
        description: String!
        price: Float!
        category: Category!
        brand: String!
        stock: Int!
        createdAt: String!
        images: [String]!
    }

    type Query {
        products: [Product]
        product(_id: ID!): Product
    }

    type Mutation {
        createProduct(product: ProductInput!): Product
        updateProduct(_id: ID!, product: ProductInput!): Product
        deleteProduct(_id: ID!): Product
    }

    input ProductInput {
        name: String!
        description: String!
        price: Float!
        category: Category!
        brand: String!
        stock: Int
        images: [String]!
    }
`;

module.exports = ProductTypeDefs;