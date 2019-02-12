const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormulaSchema = new Schema({
    _id: Schema.Types.ObjectId, 
    name: {
        type: String, 
        required: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    ingredients_list: [{
        _id: { type: Schema.Types.ObjectId, ref: 'ingredient' },
        quantity: Number
    }],
    comment: {
        type: String,
        required: false
    }
});

module.exports = Formula = mongoose.model('formula', FormulaSchema);