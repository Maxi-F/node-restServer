const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let ObjectId = mongoose.Schema.Types.ObjectId;

let Schema = mongoose.Schema;
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'la descripcion de la categoria es necesaria.']
    },
    usuario: {
        type: ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Categoria', categoriaSchema);