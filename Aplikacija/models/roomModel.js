const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'Mora postojati broj sobe']
  },
  type: {
    type: String,
    required: [true, 'Soba mora imati tip']
  },
  floor: {
    type: Number,
    required: [true, 'Morate navesti sprat na kojem se nalazi soba']
  }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
