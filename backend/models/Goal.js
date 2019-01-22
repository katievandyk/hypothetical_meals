const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    SKUs_list: [{
            SKU: { type: SKU, required: true, unique: true },
            quantity: Number
    }]
});

IngredientSchema.index({'$**': 'text'});

module.exports = Goal = mongoose.model('goal', GoalSchema);