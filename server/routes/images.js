const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verifiesTokenByURL } = require('../middlewares/autentication');

app.get('/imagen/:type/:img', verifiesTokenByURL, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    console.log(pathImg);
    if (!fs.existsSync(pathImg)) {
        res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
    } else {
        res.sendFile(pathImg);
    }

})

module.exports = app;