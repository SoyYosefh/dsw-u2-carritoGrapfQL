const moon = require('mongoose');

const ProductModel = new moon.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['Bebidas', 'Lácteos', 'Carnes', 'Frutas', 'Verduras', 'Panadería', 'Dulces', 'Limpieza', 'Higiene', 'Enlatados'],
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    images: {
        required: true,
        type: Array
    }
});

const Product = moon.model('Product', ProductModel);

module.exports = Product;