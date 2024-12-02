const mongoose = require("mongoose");

const RecoverySchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  amountRecovered: {
    type: Number,
    required: true,
  },
  recoveryDate: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Recovery", RecoverySchema);
