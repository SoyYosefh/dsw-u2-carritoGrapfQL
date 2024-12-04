
require('dotenv').config();


const mercadopago = require('mercadopago');
// Configura el SDK de Mercado Pago
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

class MercadoPagoService {
    async createPaymentPreference(cart) {
        try {
            const items = cart.productos.map(item => ({
                id: item.producto.id,
                title: item.producto.name,
                description: item.producto.description || 'Producto sin descripción',
                picture_url: item.producto.image || 'https://example.com/default-image.png',
                category_id: item.producto.category || 'others',
                quantity: item.cantidad,
                unit_price: item.producto.price,
            }));

            const preferenceData = {
                items,
                payer: {
                    first_name: cart.usuario.name,
                    last_name: cart.usuario.lastName || '',
                    phone: {
                        area_code: cart.usuario.phoneAreaCode || '00',
                        number: cart.usuario.phoneNumber || '000000000',
                    },
                    address: {
                        street_name: cart.usuario.address || 'Sin dirección',
                        street_number: cart.usuario.addressNumber || 0,
                    },
                },
                description: 'Compra en tu tienda favorita',
                external_reference: `CART_${cart._id}`,
                installments: 1,
                transaction_amount: cart.totalAmount,
                payment_method_id: 'visa', // Cambia esto según tus requerimientos
                token: '<SOME_PAYMENT_TOKEN>',
            };

            // Crear la preferencia de pago
            const response = await mercadopago.preferences.create(preferenceData);
            return response;
        } catch (error) {
            console.error('Error al crear preferencia de pago:', error);
            throw new Error('No se pudo crear la preferencia de pago');
        }
    }
}

module.exports = new MercadoPagoService();