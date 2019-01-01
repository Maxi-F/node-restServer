const jwt = require('jsonwebtoken');
const { returnError } = require('../logic/logic');

// Token verification
const verifiesToken = (token, req, res, next) => {
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) return returnError(res, 401, err);

        req.user = decoded.user;
    })
    next();
};

const verifiesTokenByHeader = (req, res, next) => {
    token = req.get('token');
    verifiesToken(token, req, res, next);
}


// Token verification By URL param
const verifiesTokenByURL = (req, res, next) => {
    let token = req.query.token;
    verifiesToken(token, req, res, next);
}

// Admin Role Verification
const verifiesAdminRole = (req, res, next) => {
    let user = req.user;
    if (user.role !== "ADMIN_ROLE") {
        return returnError(res, 403, err);
    }
    next();
}


module.exports = {
    verifiesTokenByHeader,
    verifiesAdminRole,
    verifiesTokenByURL
}