const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/config');

//.use: cada vez que se hace una peticion (ya sea GET, POST, etc.) se ejecutan estas funciones (se llaman middleware).
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//GET: Obtener informacion de la base de datos.
app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

//POST: Crear registros en la base de datos.
app.post('/usuario', function(req, res) {
    let person = req.body;

    if (person.nombre == undefined) {
        res.status(400).json({
            ok: false,
            message: "Error: There was no given name."
        });
    } else {
        res.json({
            person
        });

    }

})

//PUT: Actualizar registros de la base de datos. (casi igual que el patch)
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id; //para obtener el id mediante la peticion HTTP. (ver que "params.id" se relaciona con el :id del primer argumento).
    res.json({
        id
    });
})

//DELETE: 'eliminar' registros de la base de datos. (Usualmente en realidad es actualizar un estado para decir que no esta mas disponible el registro).
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
})
app.listen(process.env.PORT, () => console.log("listening on port", process.env.PORT));