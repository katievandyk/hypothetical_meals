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
    stop: {
        type: Date,
        required: true
    }
});

module.exports = ManufacturingActivitySchema = mongoose.model('manufacturingactivity', ManufacturingActivitySchema);