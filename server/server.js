const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path')
require('./config/config');

//.use: cada vez que se hace una peticion (ya sea GET, POST, etc.) se ejecutan estas funciones (se llaman middleware).
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Configuracion global de rutas
app.use(require('./routes/index'));

app.use(express.static(path.resolve(__dirname, '../public')))

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('DataBase ONLINE');
});

app.listen(process.env.PORT, () => console.log("listening on port", process.env.PORT));