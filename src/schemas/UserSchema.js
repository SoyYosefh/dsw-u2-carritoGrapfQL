const { gql } = require('apollo-server-express');

const UserTypeDefs = gql`
    type User {
        _id: ID!
        facturapiId: String!
        rfc: String!
        name: String!
        email: String!
        password: String!
        direccion: String!
        zip: Int!
        tel: Int!
        createdAt: String!
        role: String!
        payMethod: String!
    }

    type Query {
        users: [User]
        user(_id: ID!): User
    }

    type Mutation {
        createUser(user: UserInput!): User
        updateUser(_id: ID!, user: UserInput!): User
        deleteUser(_id: ID!): User
    }

    input UserInput {
        rfc: String!
        name: String!
        email: String!
        password: String!
        direccion: String!
        zip: Int!
        tel: Int!
        role: String!
        payMethod: String!
    }
`;

module.exports = UserTypeDefs;