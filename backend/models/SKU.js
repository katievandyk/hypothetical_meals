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
        type: String,
        required: true,
        unique: true
    },
    unit_number: {
        type: String,
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
    formula: { type: Schema.Types.ObjectId, ref: 'formula' },
    formula_scale_factor: {
        type: Number,
        required: true
    },
    manufacturing_lines: [{
        _id: { type: Schema.Types.ObjectId, ref: 'manufacturingline' }
    }],
    manufacturing_rate: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: false
    }
});

SKUSchema.index({name: 'text'});

module.exports = SKU = mongoose.model('sku', SKUSchema);