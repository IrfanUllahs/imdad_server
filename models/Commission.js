const mongoose = require('mongoose');

const CommissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model('Commission', CommissionSchema);
