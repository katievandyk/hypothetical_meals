const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductLineSchema = new Schema({
    _id: Schema.Types.ObjectId, 
    name: {
        type: String, 
        required: true,
        unique: true
    }
});

module.exports = ProductLine = mongoose.model('productLine', ProductLineSchema);