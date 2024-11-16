const { gql } = require('apollo-server-express');

const CartTypeDefs = gql`

    enum CartStatus {
        Activo
        Inactivo
    }

    # Tipo de carrito de compras
    type Cart {
        _id: ID!
        facturapiId: String
        usuario: User!
        productos: [CartProduct]!
        subtotal: Float!
        iva: Float!
        total: Float!
        createdAt: String!
        estatus: CartStatus!
        fechaCierre: String
    }

    type Product  {
        _id: ID!
        name: String
        price: Float
    }

    type User {
        _id: ID!
        name: String
        email: String
    }

    # Producto en el carrito (con cantidad) - Ahora solo con el _id del producto
    type CartProduct {
        cantidad: Int!
        producto: Product!
    }

    # Queries
    type Query {
        carts: [Cart]
        cart(cartId: ID!): Cart
        historial: [Cart]
    }

    # Mutations
    type Mutation {
        createCart( user: ID!): Cart
        closeCart(cartId: ID!): Cart
        addProductToCart(cartId: ID!, productId: ID!, cantidad: Int!): Cart
        removeProductFromCart(cartId: ID!, productId: ID!): Cart
        updateProductQuantityInCart(cartId: ID!, productId: ID!, cantidad: Int!): Cart
    }

    # Input para crear un carrito
    input CartInput {
        usuario: ID!
    }
`;

module.exports = CartTypeDefs;
