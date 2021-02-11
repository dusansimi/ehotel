const express = require('express');
const roomController = require('../controllers/roomController');
const authController = require('../controllers/authController');

// ROUTE(/rooms)

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(roomController.getAllRooms)
  .post(
    authController.restrictTo('admin'),
    roomController.findNextNumberOnFloor,
    roomController.createRoom
  );

router
  .route('/:id')
  .get(roomController.getRoom)
  .patch(authController.restrictTo('admin'), roomController.updateRoom)
  .delete(authController.restrictTo('admin'), roomController.deleteRoom);

module.exports = router;
