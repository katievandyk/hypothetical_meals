const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    SKUs: {
        type: [{SKU: SKU, quantity: Number}],
        required: true
    }
});

IngredientSchema.index({'$**': 'text'});

module.exports = Goal = mongoose.model('goal', GoalSchema);