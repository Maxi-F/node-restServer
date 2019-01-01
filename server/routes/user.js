const express = require('express');
const User = require('../models/user');
const { verifiesTokenByHeader, verifiesAdminRole } = require('../middlewares/autentication')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const { returnError, genericResponse } = require('../logic/logic');

//GET: Obtain info from dataBase.
app.get('/user', verifiesTokenByHeader, function(req, res) {

    let from = req.query.from || 0;
    from = Number(from);
    let to = req.query.to || 5;
    to = Number(to);
    let activeUsers = {
        status: true
    }

    User.find(activeUsers, 'name email role status google')
        .skip(from)
        .limit(to)
        .exec((err, usersDB) => {
            User.count(activeUsers, (err, counting) => {
                if (err) return returnError(res, 400, err);
                else return res.json({
                    ok: true,
                    users: usersDB,
                    howMany: counting
                });
            })
        });

});

//POST: Create registries in the database.
app.post('/user', [verifiesTokenByHeader, verifiesAdminRole], function(req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) return returnError(res, 400, err);
        else return genericResponse(res, 'user', userDB);
    });
})

//PUT: Update registries in the database.
app.put('/user/:id', [verifiesTokenByHeader, verifiesAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { runValidators: true, new: true }, (err, userDB) => {
        if (err) return returnError(res, 400, err);
        else return genericResponse(res, 'user', userDB);
    });
})

//DELETE: delete registries from the database.
app.delete('/user/:id', [verifiesTokenByHeader, verifiesAdminRole], function(req, res) {
    let id = req.params.id;
    let changeStatus = {
        status: false
    };

    User.findByIdAndUpdate(id, changeStatus, { new: true }, (err, userDB) => {
        if (err) return returnError(res, 400, err);
        else return genericResponse(res, 'user', userDB);
    });
});

module.exports = app;