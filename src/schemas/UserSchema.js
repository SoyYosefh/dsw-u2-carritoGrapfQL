const { gql } = require('apollo-server-express');

const UserTypeDefs = gql`
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        direccion: String!
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
        name: String!
        email: String!
        password: String!
        direccion: String!
        tel: Int!
        role: String!
        payMethod: String!
    }
`;

module.exports = UserTypeDefs;