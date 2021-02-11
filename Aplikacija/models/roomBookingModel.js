const mongoose = require('mongoose');

const roomBookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'Booking must be tied to a room']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  userId: {
    type: String
  },
  startDate: {
    type: Date,
    required: [true, 'Booking must have a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Booking must have a end date']
  },
  price: {
    type: Number,
    required: [true, 'A booking must have a price']
  },
  type: {
    type: String,
    required: [true, 'A booking must have a room type']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  },
  code: {
    type: String
  }
});

roomBookingSchema.pre('save', function (next) {
  const kod = Math.random().toString().replace('0.', '').substr(0, 5);
  this.code = kod;
  this.userId = this.user._id;
  next();
});

roomBookingSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name email' }).populate({
    path: 'room',
    select: 'number'
  });
  next();
});

const RoomBooking = mongoose.model('RoomBooking', roomBookingSchema);

module.exports = RoomBooking;
