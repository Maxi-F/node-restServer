const express = require('express');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();


const respuestaDeError = (err, respuestaPeticion) => {
    return respuestaPeticion.status(400).json({
        ok: false,
        err
    });
};

const respuestaGenerica = (res, usuarioDB) => {
    res.json({
        ok: true,
        usuario: usuarioDB
    });

};
//GET: Obtener informacion de la base de datos.
app.get('/usuario', verificaToken, function(req, res) {

    let desde = req.query.desde || 0; // hay que validar que es un numero!!
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let usuariosActivos = {
        estado: true
    }

    Usuario.find(usuariosActivos, 'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuariosDB) => {
            Usuario.count(usuariosActivos, (err, counting) => {
                if (err) return respuestaDeError(err, res);
                else return res.json({
                    ok: true,
                    usuarios: usuariosDB,
                    howMany: counting
                });
            })
        }); // para ejecutar la funcion find. (encuentra todos los usuarios, dada una condicion opcional)

});

//POST: Crear registros en la base de datos.
app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) return respuestaDeError(err, res);
        else return respuestaGenerica(res, usuarioDB);
    });
})

//PUT: Actualizar registros de la base de datos. (casi igual que el patch)
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id; // para obtener el id mediante la peticion HTTP. (ver que "params.id" se relaciona con el :id del primer argumento).
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { runValidators: true, new: true }, (err, usuarioDB) => {
        if (err) return respuestaDeError(err, res);
        else return respuestaGenerica(res, usuarioDB);
    });
})

//DELETE: 'eliminar' registros de la base de datos. (Usualmente en realidad es actualizar un estado para decir que no esta mas disponible el registro).
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    /* eliminacion fisica
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) return respuestaDeError(err, res);
        if (!usuarioBorrado) return respuestaDeError({ message: 'usuario no encontrado' }, res);
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
    */

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {
        if (err) return respuestaDeError(err, res)
        else return respuestaGenerica(res, usuarioDB);
    });
});

module.exports = app;