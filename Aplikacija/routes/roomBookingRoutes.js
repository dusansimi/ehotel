const express = require('express');
const roomBookingController = require('../controllers/roomBookingController');
const authController = require('../controllers/authController');

//ROUTE (/roombookings)

const router = express.Router();

router
  .route('/findandbook')
  .post(authController.protect, roomBookingController.findAvailableAndBook);

router.post(
  '/checkout-session',
  authController.protect,
  roomBookingController.getCheckoutSession
);

router.get('/get-key', authController.protect, roomBookingController.getKey);

router.use(authController.protect, authController.restrictTo('admin', 'staff'));

router
  .route('/')
  .get(roomBookingController.getAllRoomBookings)
  .post(roomBookingController.createRoomBooking);

router
  .route('/:id')
  .get(roomBookingController.getRoomBooking)
  .patch(roomBookingController.updateRoomBooking)
  .delete(roomBookingController.deleteRoomBooking);

module.exports = router;
