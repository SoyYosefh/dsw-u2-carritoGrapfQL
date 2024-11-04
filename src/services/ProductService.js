const Product = require('../models/ProductModel');

const getAllProducts = async () => {
    return Product.find({});
}

const getProductById = async (id) => {
    return Product.findById(id);
}

const createProduct = async (product) => {
    return Product.create(product);
}

const updateProduct = async (_id, product) => {
    return Product.findByIdAndUpdate(_id, product, { new: true });
}

const deleteProduct = async (_id) => {
    return Product.findByIdAndDelete(_id);
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}