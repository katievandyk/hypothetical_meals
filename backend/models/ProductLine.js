const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductLineSchema = new Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    }
});

module.exports = ProductLine = mongoose.model('productLine', ProductLineSchema);