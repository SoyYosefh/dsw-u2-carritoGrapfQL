const Product = require('../models/ProductModel');
const facturapi = require('../apis/facturapi');

const getAllProducts = async () => {
    return Product.find({});
}

const getProductById = async (id) => {
    return Product.findById(id);
}

const createProduct = async (product) => {
    const facturapiProduct = await facturapi.createProduct(product);
    product.facturapiId = facturapiProduct.id;
    return Product.create(product);
}

const updateProduct = async (_id, product) => {
    const productDB = await getProductById(_id);
    const facturapiId = productDB.facturapiId;
    await facturapi.updateProduct(facturapiId, product);
    return Product.findByIdAndUpdate(_id, product, { new: true });
}

const deleteProduct = async (_id) => {
    const productDB = await getProductById(_id);
    // const facturapiId = "672cdf72e24edfc2082e487c";
    const facturapiId = productDB.facturapiId;
    await facturapi.deleteProduct(facturapiId);
    // return true;
    return Product.findByIdAndDelete(_id);
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}