const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const ProductResolvers = require('./resolvers/ProductResolver');
const UserResolvers = require('./resolvers/UserResolver');

const ProductTypeDefs = require('./schemas/ProductSchema');
const UserTypeDefs = require('./schemas/UserSchema');

const startServer = async () => {
    try {
        // Conectar a la base de datos MongoDB
        await mongoose.connect('mongodb+srv://joratejedana:joratejedana@clusterdsw.7z41a.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDSW');
        // Combinar todos los typeDefs y resolvers
        const typeDefs = [ProductTypeDefs, UserTypeDefs];
        const resolvers = [ProductResolvers, UserResolvers];

        // Crear una nueva instancia de ApolloServer
        const server = new ApolloServer({ typeDefs, resolvers });

        server.listen().then(({ url }) => {
            console.log(`Servidor iniciado en ${url}`);
        });
    } catch (error) {
        console.log(error);
    }
}

startServer();

