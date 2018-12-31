const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const app = express();
const Categoria = require('../models/categoria');
const { devolverError, respuestaGenerica } = require('../logic/logic');

// Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) return devolverError(res, 500, err);
            else return respuestaGenerica(res, 'categorias', categoriasDB);
        });

});

// Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) return devolverError(res, 404, "categoria no encontrada");
        else return respuestaGenerica(res, 'categoria', categoriaDB);
    });
});

// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) return devolverError(res, 500, err);
        else if (!categoriaDB) return devolverError(res, 400, "No se pudo guardar la categoria");
        else return respuestaGenerica(res, 'categoria', categoriaDB);
    })
})

// actualizar categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) return devolverError(res, 500, err);
        else if (!categoriaDB) return devolverError(res, 404, "No se encontro la categoria a actualizar");
        else return respuestaGenerica(res, 'categoria', categoriaDB);
    });
})

// eliminar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) return devolverError(res, 500, err);
        else if (!categoriaBorrada) return devolverError(res, 404, "No se encontro la categoria a borrar");
        else return respuestaGenerica(res, 'categoria', categoriaBorrada);
    });
})

module.exports = app;