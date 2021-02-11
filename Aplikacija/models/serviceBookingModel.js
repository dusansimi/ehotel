const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'Booking must be tied to a room']
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  startTime: Date,
  endTime: Date,
  price: {
    type: Number,
    required: [true, 'A booking must have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

serviceBookingSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name email' })
    .populate({
      path: 'room',
      select: 'number'
    })
    .populate('service');
  next();
});

const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema);

module.exports = ServiceBooking;
