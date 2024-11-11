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
            return await ProductService.createProduct(product);
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