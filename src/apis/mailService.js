const mailjet = require('node-mailjet')

const mailjetClient = mailjet.apiConnect(
    "f01d3a1006cb06f01400215d4a111dfa",
    "03ae647717160b378ffdf3be6aca6425"
);

const sendCartEmail = async (email, name, cartDetails) => {
    const { productos, subtotal, iva, total } = cartDetails;

    const emailData = {
        Messages: [
            {
                From: {
                    Email: "joratejedana@ittepic.edu.mx",
                    Name: "Tu Tienda",
                },
                To: [
                    {
                        Email: email,
                        Name: name,
                    },
                ],
                Subject: "Detalles de tu carrito de compras 🛒",
                HTMLPart: `
                    <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    color: #333;
                                    padding: 20px;
                                }
                                .container {
                                    background-color: #ffffff;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                    padding: 20px;
                                    max-width: 600px;
                                    margin: 0 auto;
                                }
                                h1 {
                                    color: #4CAF50;
                                    font-size: 28px;
                                    margin-bottom: 20px;
                                }
                                p {
                                    font-size: 16px;
                                    line-height: 1.6;
                                    margin-bottom: 10px;
                                }
                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin-top: 20px;
                                }
                                th, td {
                                    padding: 12px;
                                    text-align: left;
                                    border-bottom: 1px solid #ddd;
                                }
                                th {
                                    background-color: #f2f2f2;
                                    font-weight: bold;
                                }
                                .total {
                                    font-size: 22px;
                                    font-weight: bold;
                                    color: #ffffff;
                                    background-color: #4CAF50;
                                    padding: 10px;
                                    border-radius: 5px;
                                    margin-top: 20px;
                                    text-align: center;
                                }
                                .footer {
                                    font-size: 14px;
                                    color: #777;
                                    margin-top: 30px;
                                    text-align: center;
                                }
                                .footer a {
                                    color: #4CAF50;
                                    text-decoration: none;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Gracias por tu compra, ${name}!</h1>
                                <p>Estos son los detalles de tu carrito:</p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${productos
                        .map(
                            (p) =>
                                `<tr>
                                                        <td>🛍️ ${p.producto.name} </td>
                                                        <td>${p.cantidad}</td>
                                                        <td>💵 $${p.producto.price.toFixed(2)} </td>
                                                    </tr>`
                        )
                        .join("")}
                                    </tbody>
                                </table>
                                <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                                <p><strong>IVA:</strong> $${iva.toFixed(2)}</p>
                                <div class="total"><strong>Total:</strong> $${total.toFixed(2)}</div>
                                <p>¡Esperamos que vuelvas pronto! 😊</p>
                                <div class="footer">
                                    <p>Si tienes alguna duda, no dudes en <a href="mailto:support@tutienda.com">contactarnos</a>.</p>
                                </div>
                            </div>
                        </body>
                    </html>
                `,
            },
        ],
    };

    try {
        const response = await mailjetClient.post("send", { version: "v3.1" }).request(emailData);
        console.log("Correo enviado con éxito:", response.body);
    } catch (error) {
        console.error("Error al enviar el correo:", error.message);
    }
};

module.exports = { sendCartEmail };
