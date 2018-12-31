const jwt = require('jsonwebtoken');

// verificacion de token

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) return res.status(401).json({
            ok: false,
            err: {
                message: 'Token no valido'
            }
        });

        req.usuario = decoded.usuario;
    })
    next();
};

// verificacion de rol de admin
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role !== "ADMIN_ROLE") {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'El usuario no es un Administrador'
            }
        });
    }
    next();
}

module.exports = {
    verificaToken,
    verificaAdminRole
}