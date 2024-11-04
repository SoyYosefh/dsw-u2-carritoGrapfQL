const ProductService = require('../services/ProductService');

const ProductResolvers = {
    Query: {
        products: async () => {
            return await ProductService.getAllProducts();
        },
        product: async (_, { _id }) => {
            return await ProductService.getProductById(_id);
        }
    },
    Mutation: {
        createProduct: async (_, { product }) => {
            try {
                return await ProductService.createProduct(product);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    // Creamos un mensaje personalizado para los errores de validación
                    const errorMessages = Object.values(error.errors).map(e => e.message);
                    throw new UserInputError('Error de validación en los campos proporcionados', {
                        invalidArgs: errorMessages
                    });
                }
                // Otros posibles errores
                throw new Error(`Error al crear el producto: ${error.message}`);
            }

        },
        updateProduct: async (_, { _id, product }) => {
            return await ProductService.updateProduct(_id, product);
        },
        deleteProduct: async (_, { _id }) => {
            return await ProductService.deleteProduct(_id);
        }
    }
}

module.exports = ProductResolvers;