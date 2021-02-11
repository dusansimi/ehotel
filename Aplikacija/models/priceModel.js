const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const Price = mongoose.model('Price', priceSchema);

module.exports = Price;
