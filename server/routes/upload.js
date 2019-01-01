const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const { returnError, genericResponse } = require('../logic/logic');
const { fileExistsInReq, isValidExtension } = require('../middlewares/extensions');
const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:type/:id', [fileExistsInReq, isValidExtension, ], (req, res) => {
    let file = req.files.file;
    let type = req.params.type;
    let id = req.params.id;
    let extension = file.name.split('.')[1];
    let uniqueFileId = Math.random().toString(36).substring(2, 20);

    let validTypes = ['products', 'users'];
    if (!validTypes.includes(type)) return returnError(res, 400, `Not a valid type. Valid types are: ${validTypes.join(', ')}`);

    // change file name (so it is unique)
    let fileName = `${id}-${uniqueFileId}.${extension}`
    console.log(fileName);
    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err) return returnError(res, 500, err);

        selectTypeAndUploadImg(res, type, id, fileName);
    })
});

function selectTypeAndUploadImg(res, type, id, fileName) {
    switch (type) {
        case 'users':
            imgUpload(res, User, type, id, fileName);
            break;
        case 'products':
            imgUpload(res, Product, type, id, fileName);
            break;
    }
}

function imgUpload(res, Item, typeRoute, id, fileName) {
    Item.findById(id, (err, itemDB) => {
        let typeOfItem = typeRoute.slice(0, (typeRoute.length - 1));

        if (err) {
            deleteFile(typeRoute, fileName);
            return returnError(res, 500, err);
        } else if (!itemDB) {
            deleteFile(typeRoute, fileName);
            return returnError(res, 400, `${typeOfItem} does not exist`);
        }

        deleteFile(typeRoute, itemDB.img);

        itemDB.img = fileName;

        itemDB.save((err, updatedItem) => {
            if (err) return returnError(res, 500, err);
            else return genericResponse(res, typeOfItem, updatedItem);
        })
    })
};

function deleteFile(type, imgName) {
    let pathUrl = path.resolve(__dirname, `../../uploads/${type}/${imgName}`);

    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;