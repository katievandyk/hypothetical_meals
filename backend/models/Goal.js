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
    user_id: { type: Schema.Types.ObjectId, ref: 'users' },
    deadline: {
        type: Date,
        required: true
    },
});

GoalSchema.index({'$**': 'text'});

module.exports = Goal = mongoose.model('goal', GoalSchema);