const jwt = require('jsonwebtoken');

// Return an error on the response
const returnError = (response, statusNum, err) => response.status(statusNum).json({
    ok: false,
    error: err
})

// Return OK to the response
const genericResponse = (res, typeOfItem, item) => {
    let response = {
        ok: true
    };
    response[typeOfItem] = item;
    return res.json(response);
};

// Return all OK, with a token (for user login)
const devolverRespuestaToken = (response, userDB) => {
    let token = jwt.sign({
        user: userDB
    }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

    return response.json({
        ok: true,
        user: userDB,
        token
    })
};

module.exports = {
    returnError,
    genericResponse,
    devolverRespuestaToken
}