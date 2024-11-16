const CartService = require('../services/CartService'); // Importar el servicio con la lógica de negocio
const { sendCartEmail } = require('../apis/mailService'); // Importar la función para enviar correos

const CartResolvers = {
    Query: {
        carts: async () => {
            return await CartService.getAllCarts();
        },
        // Obtener carrito por ID
        cart: async (_, { cartId }) => {
            return await CartService.getCart(cartId);
        },

        // Obtener historial de carritos (estatus: Inactivo)
        historial: async () => {
            return await CartService.getInactiveCarts();
        }
    },
    Mutation: {
        // Crear carrito
        createCart: async (_, { userId }) => {
            return await CartService.createCart(userId);
        },

        // Cerrar carrito (cambia el estatus a Inactivo)
        closeCart: async (_, { cartId }) => {
            return await CartService.closeCart(cartId);
        },

        // Agregar producto al carrito (solo _id del producto)
        addProductToCart: async (_, { cartId, productId, cantidad }) => {
            return await CartService.addProductToCart(cartId, productId, cantidad);
        },

        // Eliminar producto del carrito (solo _id del producto)
        removeProductFromCart: async (_, { cartId, productId }) => {
            return await CartService.removeProductFromCart(cartId, productId);
        },

        // Actualizar cantidad de un producto en el carrito (solo _id del producto)
        updateProductQuantityInCart: async (_, { cartId, productId, cantidad }) => {
            return await CartService.updateProductQuantityInCart(cartId, productId, cantidad);
        }
    }
};

module.exports = CartResolvers;
