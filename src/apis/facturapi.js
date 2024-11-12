const Facturapi = require('facturapi').default
const facturapi = new Facturapi('sk_test_2JxoLZ1Bw0na7O3YRz5MmlqVNwDqy49QzrAelvdbkK');

// Productos

async function createProduct(product) {
    const facturapiProduct = {
        description: product.description,
        product_key: '50202306',
        price: product.price,
    }

    return await facturapi.products.create(facturapiProduct);
}

async function updateProduct(id, product) {
    const facturapiProduct = {
        description: product.description,
        price: product.price,
    }

    return await facturapi.products.update(id, facturapiProduct);
}

async function deleteProduct(id) {
    return await facturapi.products.del(id);
}

// Clientes

async function createClient(client) {
    const facturapiClient = {
        legal_name: client.name,
        tax_id: client.rfc,
        tax_system: '608',
        email: client.email,
        address: {
            zip: client.zip + "",
        }
    }

    return await facturapi.customers.create(facturapiClient);
}

async function updateClient(id, client) {
    const facturapiClient = {
        email: client.email,
        address: {
            zip: client.zip + "",
        }
    }

    return await facturapi.customers.update(id, facturapiClient);
}

async function deleteClient(id) {
    return await facturapi.customers.del(id);
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    
    createClient,
    updateClient,
    deleteClient
}