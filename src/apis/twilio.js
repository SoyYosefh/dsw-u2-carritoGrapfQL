const twilio = require('twilio');

const accountSid = 'AC104a0fbfba36b5d381ccd5cb15910006';
const authToken = '28df7c1bf9daf15052e0b52e6ba818e6';
const client = new twilio(accountSid, authToken);

const imageUrl = 'https://despachocontablemexico.com.mx/wp-content/uploads/2021/12/contenido-factura.jpg'; // Cambia esta URL por la imagen que deseas enviar

async function sendWhatsAppMessage(to, message) {

    // Enviar mensaje de WhatsApp
    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            // contentSid: 'HX350d429d32e64a552466cafecbe95f3c',
            // contentVariables: '{"1":"12/1","2":"3pm"}',
            // to: `whatsapp:+5213111572896`,
            to: `whatsapp:${to}`,
            body: message,
            mediaUrl: imageUrl // URL de la imagen
        })
        .then(message => console.log(message.sid))
        .catch(error => console.error('Error:', error));
}

module.exports = {
    sendWhatsAppMessage
};