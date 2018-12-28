const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario.']
    },
    password: {
        type: String,
        required: [true, 'Falta la contrasenña']
    },
    img: {
        type: String,
        required: false // se puede obviar si es false.
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
        let user = this;
        let userObject = user.toObject();
        delete userObject.password;

        return userObject;
    } // Para eliminar la contrasenia de lo que vamos a devolver. toJSON se activa cuando se va a mostrar algo.

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico.'
});

module.exports = mongoose.model('Usuario', usuarioSchema);