const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const User = require('../models/user');
const app = express();
const { returnError, devolverRespuestaToken } = require('../logic/logic')

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) return returnError(res, 500, err);

        if (!userDB || !bcrypt.compareSync(body.password, userDB.password)) return returnError(res, 400, "incorrect user or password");

        return devolverRespuestaToken(res, userDB);
    })
});

// configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
        name: payload.name,
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
        returnError(res, 403, "Token not valid");
    }

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {

            return returnError(res, 500, err);

        } else if (userDB) {
            if (!userDB.google) {
                return returnError(res, 400, "Debe ingresar con la autentication normal");

            } else {
                return devolverRespuestaToken(res, userDB);
            };
        } else { // Crear un nuevo user en la base de datos
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':c' // No importa que ponga aca, ya que nunca va a poder matchear (Las contraseñas para el login se hashean 10 veces, nunca va a matchear con una carita triste :c)
            });
            user.save((err, userDB) => {
                if (err) return returnError(res, 500, err);
                else return devolverRespuestaToken(res, user);
            })
        }
    })
});

module.exports = app;