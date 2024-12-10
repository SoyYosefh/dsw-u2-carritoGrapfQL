// src/api/stripeService.js
require('dotenv').config(); // Asegúrate de tener dotenv configurado
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Crea un Payment Intent en Stripe
 * @param {number} total - Total del carrito (en dólares o moneda base)
 * @param {string} cartId - ID del carrito
 * @param {string} userId - ID del usuario asociado al carrito
 * @returns {Promise<object>} PaymentIntent creado
 */
const createPaymentIntent = async (total, cartId, userId) => {

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Convertir a centavos
            currency: 'mxn', // Cambia según tus necesidades
            payment_method_types: ['card'], // Métodos de pago permitidos
            description: `Pago por carrito #${cartId}`,
            metadata: {
                cartId: cartId.toString(),
                userId: userId.toString(),
            },
        });

        return paymentIntent;
    } catch (error) {
        throw new Error("No se pudo procesar el pago.");
    }
};

module.exports = {
    createPaymentIntent,
};
