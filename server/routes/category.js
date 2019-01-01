const express = require('express');
const { verifiesTokenByHeader, verifiesAdminRole } = require('../middlewares/autentication')
const app = express();
const Category = require('../models/category');
const { returnError, genericResponse } = require('../logic/logic');

// Show all categories
app.get('/category', verifiesTokenByHeader, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categoriesDB) => {
            if (err) return returnError(res, 500, err);
            else return genericResponse(res, 'categories', categoriesDB);
        });

});

// Show one category by ID
app.get('/category/:id', verifiesTokenByHeader, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) return returnError(res, 404, "category not found");
        else return genericResponse(res, 'category', categoryDB);
    });
});

// Create new category
app.post('/category', verifiesTokenByHeader, (req, res) => {
    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user._id
    })

    category.save((err, categoryDB) => {
        if (err) return returnError(res, 500, err);
        else return genericResponse(res, 'category', categoryDB);
    })
})

// Update category
app.put('/category/:id', verifiesTokenByHeader, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategory = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, descCategory, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) return returnError(res, 500, err);
        else if (!categoryDB) return returnError(res, 404, "category to update not found.");
        else return genericResponse(res, 'category', categoryDB);
    });
})

// Delete category
app.delete('/category/:id', [verifiesTokenByHeader, verifiesAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, deletedCategory) => {
        if (err) return returnError(res, 500, err);
        else if (!deletedCategory) return returnError(res, 404, "category to delete not found.");
        else return genericResponse(res, 'category', deletedCategory);
    });
})

module.exports = app;