const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  name: String,
  stars: {
    type: Number,
    min: 1,
    max: 5
  },
  coverPhoto: String,
  otherPhotos: [String],
  description: String,
  reviewRatingsAverage: Number,
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String
  }
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;
