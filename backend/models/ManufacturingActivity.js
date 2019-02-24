const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturingActivitySchema = new Schema({
    _id: Schema.Types.ObjectId, 
    name: {
        type: String, 
        required: true
    },
    sku: {
        type: Schema.Types.ObjectId,
        ref: 'sku',
        required: true
    },
    line: {
        type: Schema.Types.ObjectId,
        ref: 'manufacturingline',
        required: true
    },
    start: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, //Number of hours
        required: true
    },
    goal_id: {
        type: String,
        ref: 'goal',
        required: true
    }
});

module.exports = ManufacturingActivity = mongoose.model('manufacturingactivity', ManufacturingActivitySchema);