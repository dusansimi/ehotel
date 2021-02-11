const Room = require('../models/roomModel');
const catchAsync = require('../utillities/catchAsync');
const factory = require('./handlerFactory');

exports.findNextNumberOnFloor = catchAsync(async (req, res, next) => {
  const { floor } = req.body;
  const rooms = await Room.find({ floor: floor });
  let newNumber;
  if (!rooms[0]) {
    newNumber = `${floor}01`;
  } else {
    newNumber = rooms[rooms.length - 1].number + 1;
  }
  req.body.number = newNumber;
  next();
});

exports.createRoom = factory.createOne(Room);
exports.getAllRooms = factory.getAll(Room);
exports.getRoom = factory.getOne(Room);
exports.updateRoom = factory.updateOne(Room);
exports.deleteRoom = factory.deleteOne(Room);
