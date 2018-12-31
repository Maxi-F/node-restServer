const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion')
const app = express();
const _ = require('underscore');
const { devolverError, respuestaGenerica } = require('../logic/logic');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

// Obtener todos los productos
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    let productoDisponible = {
        disponible: true
    }

    Producto.find(productoDisponible)
        .skip(desde)
        .limit(hasta)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productosDB) => {
            if (err) return devolverError(res, 500, err);
            else return respuestaGenerica(res, 'productos', productosDB);
        });
    // trae todos los productos, populate el usuario y la categoria.
    // paginado.
})

// obtener un producto por ID
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) return devolverError(res, 500, err);
            else if (!productoDB) return devolverError(res, 400, "producto no encontrado");
            else return respuestaGenerica(res, 'producto', productoDB);
        });
    // populate: usuario categoria
    // paginado
})

// buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) return devolverError(res, 500, err);
            else return respuestaGenerica(res, 'productos', productosDB);
        })

})

app.post('/productos', verificaToken, async(req, res) => {
    // grabar el usuario y una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) return devolverError(res, 500, err);
        else if (!productoDB) return devolverError(res, 400, "No se pudo crear el producto");
        else return respuestaGenerica(res, 'Producto', productoDB);
    })
})

// Actualizar un nuevo producto
app.put('/productos/:id', verificaToken, async(req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findById(id, (err, productoDB) => {
        if (err) return devolverError(res, 500, err);
        else if (!productoDB) return devolverError(res, 400, "No se encuentra el producto");

        for (let key in body) {
            productoDB[key] = body[key];
        };

        productoDB.save((errorUpdate, productoActualizado) => {
            if (errorUpdate) return devolverError(res, 500, errorUpdate);
            else return respuestaGenerica(res, 'producto', productoActualizado);

        })
    })
})

// borrar un producto
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) return devolverError(res, 500, err);
        else if (!productoDB) return devolverError(res, 400, "producto no encontrado");

        productoDB.disponible = false;
        productoDB.save((errorDelete, productoBorrado) => {
            if (errorDelete) return devolverError(res, 500, errorDelete);
            else return respuestaGenerica(res, 'producto', productoBorrado);

        });
    });
    // eliminacion por estado!
})

module.exports = app;