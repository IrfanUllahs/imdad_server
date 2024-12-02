// models/PurchaseHistory.js
const mongoose = require('mongoose');

const PurchaseHistorySchema = new mongoose.Schema({
    pkr: {
        type: Number,
        required: true,
    },
    amountInSelectedCurrency: {
        type: Number,
        required: true,
    },
    selectedCurrency: {
        type: String,
        required: true,
    },
    selectedCurrencySymbol: {
        type: String,
        required: true,
    },
    date: {
        type: Date, // Use Date type for default `now`
        default: Date.now, // Sets default to the current date and time
    },
});

module.exports = mongoose.model('PurchaseHistory', PurchaseHistorySchema);
