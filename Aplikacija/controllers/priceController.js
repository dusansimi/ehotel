const Price = require('../models/priceModel');
const factory = require('./handlerFactory');

exports.createPrice = factory.createOne(Price);
exports.getAllPrices = factory.getAll(Price);
exports.getPrice = factory.getOne(Price);
exports.updatePrice = factory.updateOne(Price);
exports.deletePrice = factory.deleteOne(Price);
