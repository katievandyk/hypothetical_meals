const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturingLineSchema = new Schema({
    _id: Schema.Types.ObjectId, 
    name: {
        type: String, 
        required: true
    },
    shortname: {
        type: String,
        required: true,
        unique: true
    },
    comment: {
        type: String,
        required: false
    }
});

module.exports = ManufacturingLine = mongoose.model('maufacturingline', ManufacturingLineSchema);