const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
   },
  purchasePrice: { 
    type: Number, 
    required: true
   }, // Purchase price of the product
  salePrice: { 
    type: Number, 
    required: true 
  }, // Sale price of the product
  size: {
    type:String
  },
  weight:{
    type: String
  },
  quantity: {
    type: Number
   }, // Quantity available in stock
  soldQuantity: { 
    type: Number,
    default: 0
   }, // Quantity sold, default to 0
  profitPerItem: {
    // Calculate profit per item automatically
    type: Number,
    default: function () {
      return this.salePrice - this.purchasePrice;
    },
  },
  totalProfit: {
    // Total profit (based on sold items)
    type: Number,
    default: function () {
      return this.soldQuantity * (this.salePrice - this.purchasePrice);
    },
  },
});

module.exports = mongoose.model("Stock", ProductsSchema);
