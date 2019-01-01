const express = require('express');
const { verifiesTokenByHeader } = require('../middlewares/autentication')
const app = express();
const _ = require('underscore');
const { returnError, genericResponse } = require('../logic/logic');
const Product = require('../models/product');
const Category = require('../models/category');

// Obtain all products
app.get('/products', verifiesTokenByHeader, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let to = req.query.to || 5;
    to = Number(to);

    let avaliableProducts = {
        avaliable: true
    }

    Product.find(avaliableProducts)
        .skip(from)
        .limit(to)
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, productsDB) => {
            if (err) return returnError(res, 500, err);
            else return genericResponse(res, 'products', productsDB);
        });
})

// Obtain product by ID
app.get('/products/:id', verifiesTokenByHeader, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, productDB) => {
            if (err) return returnError(res, 500, err);
            else if (!productDB) return returnError(res, 400, "product not found");
            else return genericResponse(res, 'product', productDB);
        });
})

// search products
app.get('/products/search/:term', verifiesTokenByHeader, (req, res) => {

    let term = req.params.term;
    let regex = new RegExp(term, 'i');

    Product.find({ name: regex })
        .populate('category', 'description')
        .exec((err, productsDB) => {
            if (err) return returnError(res, 500, err);
            else return genericResponse(res, 'products', productsDB);
        })

})

// create new product
app.post('/products', verifiesTokenByHeader, async(req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        avaliable: body.avaliable,
        category: body.category,
        user: req.user._id
    })

    product.save((err, productDB) => {
        if (err) return returnError(res, 500, err);
        else return genericResponse(res, 'Product', productDB);
    })
})

// Actualizar un nuevo product
app.put('/products/:id', verifiesTokenByHeader, async(req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'unitPrice', 'description', 'avaliable', 'category']);

    Product.findById(id, (err, productDB) => {
        if (err) return returnError(res, 500, err);
        else if (!productDB) return returnError(res, 400, "product not found");

        for (let key in body) {
            productDB[key] = body[key];
        };

        productDB.save((updatingError, updatedProduct) => {
            if (updatingError) return returnError(res, 500, updatingError);
            else return genericResponse(res, 'product', updatedProduct);

        })
    })
})

// delete product
app.delete('/products/:id', verifiesTokenByHeader, (req, res) => {
    let id = req.params.id;

    Product.findById(id, (err, productDB) => {
        if (err) return returnError(res, 500, err);
        else if (!productDB) return returnError(res, 400, "product not found");

        productDB.avaliable = false;
        productDB.save((deletingError, deletedProduct) => {
            if (deletingError) return returnError(res, 500, deletingError);
            else return genericResponse(res, 'product', deletedProduct);

        });
    });
})

module.exports = app;