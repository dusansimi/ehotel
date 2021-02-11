const AppError = require('../utillities/appError');
const ServiceBooking = require('../models/serviceBookingModel');
const ServiceModel = require('../models/serviceModel');
const RoomModel = require('../models/roomModel');
const catchAsync = require('../utillities/catchAsync');
const factory = require('./handlerFactory');

exports.createServiceBooking = factory.createOne(ServiceBooking);
exports.getAllServiceBookings = factory.getAll(ServiceBooking);
exports.getServiceBooking = factory.getOne(ServiceBooking);
exports.updateServiceBooking = factory.updateOne(ServiceBooking);
exports.deleteServiceBooking = factory.deleteOne(ServiceBooking);

exports.bookService = catchAsync(async (req, res, next) => {
  if (req.user.inHotel == true) {
    req.body.user = req.user.id;
    req.body.room = await RoomModel.findOne({ number: req.user.inRoom });

    const service = await ServiceBooking.create(req.body);

    res.status(200).json({
      status: 'success',
      service
    });
    return;
  }
  next(new AppError('user must be in hotel to book a service', 400));
  return;
});
