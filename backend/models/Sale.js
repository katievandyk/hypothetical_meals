const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleSchema = new Schema({
    sku: { type: Schema.Types.ObjectId, ref: 'sku' },
    customer: { type: Schema.Types.ObjectId, ref: 'customer'},
    year: {
        type: Number,
        required: true,
    },
    week: {
        type: Number,
        required: true,
    },
    sales: {
        type: Number,
        required: true,
    },
    price_per_case: {
        type: Number,
        required: true,
    }
});

SaleSchema.index({sku: 1, customer: 1, year: 1, week: 1}, { unique: true });

module.exports = Sale = mongoose.model('sale', SaleSchema);