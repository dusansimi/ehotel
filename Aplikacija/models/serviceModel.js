const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ['food', 'drinks', 'service']
  },
  price: Number
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
