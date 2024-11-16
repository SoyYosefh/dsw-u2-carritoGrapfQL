const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const ProductResolvers = require('./resolvers/ProductResolver');
const UserResolvers = require('./resolvers/UserResolver');
const CartResolvers = require('./resolvers/CartResolver');

const ProductTypeDefs = require('./schemas/ProductSchema');
const UserTypeDefs = require('./schemas/UserSchema');
const CartTypeDefs = require('./schemas/CartSchema');

const startServer = async () => {
    try {
        // Conectar a la base de datos MongoDB
        await mongoose.connect('mongodb+srv://joratejedana:joratejedana@clusterdsw.7z41a.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDSW')
            .then(() => console.log('Conectado a MongoDB'))
            .catch(err => console.error('Error al conectar a MongoDB:', err));
        // Combinar todos los typeDefs y resolvers
        const typeDefs = [ProductTypeDefs, UserTypeDefs, CartTypeDefs];
        const resolvers = [ProductResolvers, UserResolvers, CartResolvers];

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

