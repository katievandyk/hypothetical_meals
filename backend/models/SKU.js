const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SKUSchema = new Schema({
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
    product_line: {
        type: String,
        required: true
    },
    ingredients_list: [{
        name: String,
        quantity: Number
    }],
    comments: {
        type: String,
        required: false
    }
});

SKUSchema.index({'$**': 'text'});

module.exports = SKU = mongoose.model('sku', SKUSchema);