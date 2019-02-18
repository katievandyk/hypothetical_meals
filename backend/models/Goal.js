const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    skus_list: [{
            sku: { type: Schema.Types.ObjectId, ref: 'sku' },
            quantity: Number
    }],
    user_username: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
});

module.exports = Goal = mongoose.model('goal', GoalSchema);