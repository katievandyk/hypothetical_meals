const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    vendor_info: {
        type: String,
        required: false
    },
    package_size: {
        type: String,
        required: true
    },
    cost_per_package: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: false
    }
});

module.exports = Ingredient = mongoose.model('ingredient', IngredientSchema);