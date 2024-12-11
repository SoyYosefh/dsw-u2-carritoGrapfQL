const facturapi = require('../apis/facturapi');
const CartModel = require('../models/CartModel');
const ProductModel = require('../models/ProductModel');
const UserModel = require('../models/UserModel');
const UserServices = require('./UserService');
const { sendCartEmail } = require('../apis/mailService');
const { sendWhatsAppMessage } = require('../apis/twilio');
const { createPaymentIntent } = require('../apis/stripeService');
const { generateCartPdf } = require('../utils/createPDF');
const mongoose = require('mongoose');


// Función para formatear la fecha
function obtenerFechaActual() {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date();
    return fecha.toLocaleDateString('es-ES', opciones).replace(',', '');
}


const getAllCarts = async () => {
    return CartModel.find({}).populate('productos.producto').populate('usuario');
}

// Query: leer carrito
const getCart = async (cartId) => {
    console.log("🚀 ~ getCart ~ cartId:", cartId)
    try {
        const cart = await CartModel.findById(cartId)
            .populate('usuario')           // Popula el usuario
            .populate('productos.producto'); // Popula los productos dentro del carrito

        console.log("🚀 ~ getCart ~ cart:", cart)
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        return cart;
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        throw error;
    }
}

// Query: leer historial de carritos (estatus: Inactivo)
const getInactiveCarts = async () => {
    return CartModel.find({ estatus: 'Inactivo' });
}

// Mutation: crear carrito
const createCart = async (userId) => {
    // Verificar si el usuario existe
    const user = await UserServices.getAllUsers(userId); // Aquí deberías verificar cómo se obtienen los usuarios
    if (!user || user.length === 0) {
        throw new Error("Usuario no encontrado");
    }

    // Verificar que el usuario tenga un campo 'name'
    if (!user.name) {
        throw new Error("El usuario no tiene un nombre");
    }

    const cart = {
        usuario: userId, // Usar el ID del usuario
        productos: [], // Inicializa la lista de productos vacía
        subtotal: 0, // Subtotal inicial
        iva: 0, // IVA inicial
        total: 0, // Total inicial
        estatus: 'Activo', // Estatus del carrito
    };

    console.log("🚀 ~ createCart ~ cart:", cart);

    // Guardar el carrito en la base de datos
    return CartModel.create(cart);
};


// Mutation: cerrar carrito (se cambia solo el estatus a Inactivo y se agrega la fecha de cierre)
const closeCart = async (cartId) => {
    const cartDB = await CartModel.findById(cartId).populate('productos.producto').populate('usuario');
   
    // Verificar si el carrito existe
    if (!cartDB) {
        throw new Error("El carrito no existe");
    }

    // Actualizar el estado del carrito
    cartDB.estatus = "Inactivo";
    cartDB.fechaCierre = new Date();

    // Guardar los cambios
    const updatedCart = await cartDB.save();

    // Enviar correo al usuario
    try {

        // Hacer pago con Stripe
        const paymentIntent = await createPaymentIntent(cartDB.total, cartId, cartDB.usuario._id);

        const cartDetails = {
            productos: cartDB.productos,
            subtotal: cartDB.subtotal,
            iva: cartDB.iva,
            total: cartDB.total,
        };

        // Crear el PDF del carrito
        const publicUrl = await generateCartPdf(cartDB.usuario.email, cartDB.usuario.name, cartDetails);

        // Enviar correo al usuario
        await sendCartEmail(cartDB.usuario.email, cartDB.usuario.name, cartDetails, publicUrl);


        // Crear la factura en Facturapi
        const facturaApiPayload = {
            customer: cartDB.usuario.facturapiId, // ID del cliente en Facturapi
            items: cartDB.productos.map(producto => ({
                product: producto.producto.facturapiId, // ID del producto en Facturapi
                quantity: producto.cantidad // Cantidad del producto
            })),
            payment_form: '01',
            use: 'G01'
        };

        // Crear la factura en Facturapi
        const factura = await facturapi.createFactura(facturaApiPayload);

        // Productos en una cadena de texto en formato de lista desordenada
        const productosString = cartDB.productos.map(item => {
            const producto = item.producto;
            return `- ${producto.name} - ${item.cantidad} x $${producto.price}\n`;
        }).join('');

        const bodyMessage = `Hola,\n\n` +
            `Haz facturado una nueva venta el día ${obtenerFechaActual()}.\n\n` +
            `¡Gracias por tu atención! \n\n` +
            `*Productos:*\n` +
            `${productosString} \n\n` +
            `*Subtotal:* $${cartDB.subtotal}\n` +
            `*IVA:* $${cartDB.iva}\n` +
            `*Total:* $${cartDB.total}\n\n` +
            `Ve tu factura en el siguiente enlace: ${publicUrl}\n\n`;


        // Enviar mensaje de WhatsApp
        await sendWhatsAppMessage("+5213111572896", bodyMessage);


    } catch (error) {
        console.error("Error:", error.message);
    }

    return updatedCart;
};

// Mutation: agregar producto al carrito
const addProductToCart = async (cartId, productId, cantidad = 1) => {
    const cartDB = await CartModel.findById(cartId);

    if (!cartDB) {
        throw new Error("Carrito no encontrado");
    }

    const existingProduct = cartDB.productos.find(
        item => item.producto.toString() === productId
    );

    if (existingProduct) {
        existingProduct.cantidad += cantidad;
    } else {
        cartDB.productos.push({
            producto: productId,
            cantidad
        });
    }

    await cartDB.save();

    // Usar populate para obtener los datos completos del producto
    await cartDB.populate('productos.producto');
    return calculateCartTotals(cartId); // Devuelve el carrito completo con los productos populados
};

// Mutation: eliminar producto del carrito
const removeProductFromCart = async (cartId, productId) => {
    // Buscar el carrito por su ID y popular los productos
    const cartDB = await CartModel.findById(cartId).populate("productos.producto");
    if (!cartDB) {
        throw new Error("El carrito no existe");
    }

    // Filtrar los productos para eliminar el que coincide con el productId
    cartDB.productos = cartDB.productos.filter(
        item => item.producto._id.toString() !== productId
    );

    // Guardar los cambios en el carrito
    await cartDB.save();

    // Recalcular los totales y devolver el carrito actualizado
    return calculateCartTotals(cartId);// Devuelve el carrito completo actualizado
};


// Mutación: Actualizar cantidad de un producto en el carrito
const updateProductQuantityInCart = async (cartId, productId, cantidad) => {
    // Buscar el carrito por su ID y popular los productos
    const cartDB = await CartModel.findById(cartId).populate("productos.producto");
    if (!cartDB) {
        throw new Error("El carrito no existe");
    }

    // Buscar el producto en el carrito usando el _id
    const existingProduct = cartDB.productos.find(
        item => item.producto._id.toString() === productId
    );

    if (!existingProduct) {
        throw new Error("Producto no encontrado en el carrito");
    }

    if (cantidad <= 0) {
        // Si la cantidad es 0 o menor, eliminar el producto del carrito
        cartDB.productos = cartDB.productos.filter(
            item => item.producto._id.toString() !== productId
        );
    } else {
        // Si la cantidad es válida, actualizar la cantidad del producto
        existingProduct.cantidad = cantidad;
    }

    // Guardar los cambios en el carrito
    await cartDB.save();

    // Recalcular los totales y devolver el carrito actualizado
    return calculateCartTotals(cartId);
};

// Función para calcular el subtotal, IVA y total de un carrito
const calculateCartTotals = async (cartId) => {
    const ivaRate = 0.16; // Tasa del IVA (por ejemplo, 16%)

    // Buscar el carrito completo
    const cart = await CartModel.findById(cartId)
        .populate('productos.producto')
        .populate('usuario');

    if (!cart) {
        throw new Error('El carrito no existe');
    }

    let subtotal = 0;

    // Recorrer los productos del carrito y calcular el subtotal
    cart.productos.forEach(item => {
        const producto = item.producto; // Producto ya poblado con los detalles del modelo ProductFacturapi

        if (producto && producto.price && item.cantidad) {
            subtotal += producto.price * item.cantidad; // Usar el precio del producto del modelo
        } else {
            console.log("Producto sin precio o cantidad no válida:", producto);
        }
    });

    // Calcular el IVA
    const iva = subtotal * ivaRate;
    const total = subtotal + iva;

    // Actualizar el carrito con los valores calculados redondeados a 2 decimales
    cart.subtotal = subtotal.toFixed(2);
    cart.iva = iva.toFixed(2);
    cart.total = total.toFixed(2);

    // Guardar los cambios en el carrito
    await cart.save();

    // Retornar el carrito completo actualizado
    return cart;
};

module.exports = {
    getAllCarts,
    getCart,
    getInactiveCarts,
    createCart,
    closeCart,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantityInCart
};