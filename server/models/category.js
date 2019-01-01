const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let ObjectId = mongoose.Schema.Types.ObjectId;

let Schema = mongoose.Schema;
let categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'Category description is required.']
    },
    user: {
        type: ObjectId,
        ref: 'User'
    }
});

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Category', categorySchema);