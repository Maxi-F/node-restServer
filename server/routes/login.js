const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario');
const app = express();

const devolverError = (response, statusNum, err) => response.status(statusNum).json({
    ok: false,
    error: err
})

const devolverRespuestaToken = (response, usuarioDB) => {
    let token = jwt.sign({
        usuario: usuarioDB
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

    return response.json({
        ok: true,
        usuario: usuarioDB,
        token
    })
}

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) return devolverError(res, 500, err);

        if (!usuarioDB || !bcrypt.compareSync(body.password, usuarioDB.password)) return devolverError(res, 400, "Usuario o contraseña incorrectos");

        return devolverRespuestaToken(res, usuarioDB);
    })


})

// configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
};

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser;
    try {
        googleUser = await verify(token)
    } catch (err) {
        devolverError(res, 403, "Token no Valido");
    }

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {

            return devolverError(res, 500, err);

        } else if (usuarioDB) {
            if (!usuarioDB.google) {
                return devolverError(res, 400, "Debe ingresar con la autenticacion normal");

            } else {
                return devolverRespuestaToken(res, usuarioDB);
            };
        } else { // Crear un nuevo usuario en la base de datos
            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':c' // No importa que ponga aca, ya que nunca va a poder matchear (Las contraseñas para el login se hashean 10 veces, nunca va a matchear con una carita triste :c)
            });
            usuario.save((err, usuarioDB) => {
                if (err) return devolverError(res, 500, err);
                else return devolverRespuestaToken(res, usuario);
            })
        }
    })
});

module.exports = app;