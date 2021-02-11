const About = require('../models/aboutModel');
const factory = require('./handlerFactory');

exports.createAbout = factory.createOne(About);
exports.getAbout = factory.getAll(About);
exports.updateAbout = factory.updateOne(About);
exports.deleteAbout = factory.deleteOne(About);
