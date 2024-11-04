const UserService = require('../services/UserService');

const UserResolvers = {
    Query: {
        users: async () => {
            return await UserService.getAllUsers();
        },
        user: async (_, { _id }) => {
            return await UserService.getUserById(_id);
        }
    },
    Mutation: {
        createUser: async (_, { user }) => {
            try {
                return await UserService.createUser(user);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    // Creamos un mensaje personalizado para los errores de validación
                    const errorMessages = Object.values(error.errors).map(e => e.message);
                    throw new UserInputError('Error de validación en los campos proporcionados', {
                        invalidArgs: errorMessages
                    });
                }
                // Otros posibles errores
                throw new Error(`Error al crear el usuario: ${error.message}`);
            }

        },
        updateUser: async (_, { _id, user }) => {
            return await UserService.updateUser(_id, user);
        },
        deleteUser: async (_, { _id }) => {
            return await UserService.deleteUser(_id);
        }
    }
}

module.exports = UserResolvers;