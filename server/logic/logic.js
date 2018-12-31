const jwt = require('jsonwebtoken');

// devolver un error
const devolverError = (response, statusNum, err) => response.status(statusNum).json({
    ok: false,
    error: err
})

// devolver todo bien
const respuestaGenerica = (res, typeOfItem, itemDB) => {
    let response = {
        ok: true
    };
    response[typeOfItem] = itemDB;
    return res.json(response);
};

// devolver todo bien, con token
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

module.exports = {
    devolverError,
    respuestaGenerica,
    devolverRespuestaToken
}