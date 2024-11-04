const { gql } = require('apollo-server-express');

const ProductTypeDefs = gql`
    type Product {
        _id: ID!
        name: String!
        description: String!
        price: Float!
        category: String!
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
        category: String!
        brand: String!
        stock: Int
        images: [String]!
    }
`;

module.exports = ProductTypeDefs;