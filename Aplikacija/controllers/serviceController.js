const Service = require('../models/serviceModel');
const factory = require('./handlerFactory');

exports.createService = factory.createOne(Service);
exports.getAllServices = factory.getAll(Service);
exports.getService = factory.getOne(Service);
exports.updateService = factory.updateOne(Service);
exports.deleteService = factory.deleteOne(Service);
