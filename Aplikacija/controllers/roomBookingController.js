const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const uuid = require('uuid-v4');
const RoomBooking = require('../models/roomBookingModel');
const Price = require('../models/priceModel');
const Room = require('../models/roomModel');
const User = require('../models/userModel');
const catchAsync = require('../utillities/catchAsync');
const factory = require('./handlerFactory');
const startOfDay = require('date-fns/startOfDay');
const endOfDay = require('date-fns/endOfDay');
const intervalToDuration = require('date-fns/intervalToDuration');
const AppError = require('../utillities/appError');

exports.createRoomBooking = factory.createOne(RoomBooking);
exports.getAllRoomBookings = factory.getAll(RoomBooking);
exports.getRoomBooking = factory.getOne(RoomBooking);
exports.updateRoomBooking = factory.updateOne(RoomBooking);
exports.deleteRoomBooking = factory.deleteOne(RoomBooking);

exports.findAvailableAndBook = catchAsync(async function (req, res) {
  const type = req.body.type;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const book = req.body.book;

  if (
    new Date(startDate) > new Date(endDate) ||
    new Date(startDate) < new Date()
  ) {
    res.status(400).json({
      status: 'fail',
      data: 'No rooms available'
    });
    return;
  }

  let rooms = await Room.find({ type: type });
  let reservations = await RoomBooking.find({ type: type });
  reservations = reservations.filter((res) => {
    if (
      new Date(startDate) >= res.startDate &&
      new Date(startDate) <= res.endDate
    )
      return true;
    if (new Date(endDate) >= res.startDate && new Date(endDate) <= res.endDate)
      return true;
    if (
      new Date(startDate) <= res.startDate &&
      new Date(endDate) >= res.endDate
    )
      return true;
    return false;
  });

  rooms.forEach((room) => {
    let free = true;
    reservations.forEach((res) => {
      if (room.number == res.room.number) free = false;
    });
    if (free) {
      //bukiraj sobu
      req.body.room = room._id;
    }
  });
  if (req.body.room && book == true) {
    const priceModel = await Price.findOne({ type: req.body.type });
    req.body.price = priceModel.price;
    req.body.user = req.user;
    const doc = await RoomBooking.create(req.body);
    res.status(201).json({
      status: 'sucess',
      data: {
        data: doc
      }
    });
  } else if (req.body.room) {
    res.status(201).json({
      status: 'sucess',
      data: {
        data: req.body.room
      }
    });
  } else {
    res.status(400).json({
      status: 'fail',
      data: 'No rooms available'
    });
  }
  return;
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1 Get currently booked room & price
  const token = req.body.token;
  const room = await Room.findById(req.body.info.roomId);
  const price = await Price.findOne({ type: `${room.type}` });
  const start = req.body.info.startDate.split('-');
  const newStart = `${start[2]}-${start[1]}-${start[0]}`;
  const end = req.body.info.endDate.split('-');
  const newEnd = `${end[2]}-${end[1]}-${end[0]}`;
  const dayss = intervalToDuration({
    start: startOfDay(new Date(newStart)),
    end: endOfDay(new Date(newEnd))
  }).days;

  const customer = await stripe.customers.create({
    email: token.email,
    source: token.id
  });

  const idempotencyKey = uuid();
  const charge = await stripe.charges.create(
    {
      amount: price.price * dayss,
      currency: 'eur',
      customer: customer.id,
      description: `Rezervacija sobe ${room.number}`
    },
    {
      idempotencyKey
    }
  );

  const newBooking = await RoomBooking.create({
    room: req.body.info.roomId,
    user: req.user,
    startDate: newStart,
    endDate: newEnd,
    price: price.price * dayss,
    type: room.type
  });

  res.status(200).json({
    status: 'success',
    data: {
      newBooking
    }
  });
});

exports.getKey = catchAsync(async (req, res, next) => {
  const bookings = await RoomBooking.find({
    userId: `${req.user.id}`,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });

  if (bookings === undefined || bookings.length == 0) {
    res.status(200).json({
      status: 'fail'
    });
    return;
  }
  let key = bookings[0].code;
  await User.findByIdAndUpdate(req.user.id, {
    inHotel: true,
    inRoom: bookings[0].room.number
  });

  res.status(200).json({
    status: 'success',
    key
  });
});
