const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SKUSchema = new Schema({
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
    case_number: {
        type: Number,
        required: true,
        unique: true
    },
    unit_number: {
        type: Number,
        required: true
    },
    unit_size: {
        type: String,
        required: true
    },
    count_per_case: {
        type: Number,
        required: true 
    },
    product_line: { type: Schema.Types.ObjectId, ref: 'productLine'},
    ingredients_list: [{
        _id: { type: Schema.Types.ObjectId, ref: 'ingredient' },
        quantity: Number
    }],
    comments: {
        type: String,
        required: false
    }
});

SKUSchema.index({'$**': 'text'});

module.exports = SKU = mongoose.model('sku', SKUSchema);