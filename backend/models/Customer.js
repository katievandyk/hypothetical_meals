const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    _id: Schema.Types.ObjectId, 
    name: {
        type: String, 
        required: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    }
});

CustomerSchema.index({name: 'text'});

module.exports = Customer = mongoose.model('customer', CustomerSchema);