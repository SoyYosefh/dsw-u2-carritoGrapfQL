const moon = require('mongoose');

const UserModel = new moon.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    tel: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    payMethod: {
        type: String,
        enum: ['CREDIT', 'DEBIT', 'PAYPAL', 'CASH'],
        default: 'CASH'
    }
});

const User = moon.model('Usuario', UserModel);

module.exports = User;