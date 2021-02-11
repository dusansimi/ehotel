const express = require('express');
const serviceBookingController = require('../controllers/serviceBookingController');
const authController = require('../controllers/authController');

//ROUTE (/servicebookings)

const router = express.Router();

router.post(
  '/bookservice',
  authController.protect,
  serviceBookingController.bookService
);

router.use(authController.protect, authController.restrictTo('admin', 'staff'));

router
  .route('/')
  .get(serviceBookingController.getAllServiceBookings)
  .post(serviceBookingController.createServiceBooking);

router
  .route('/:id')
  .get(serviceBookingController.getServiceBooking)
  .patch(serviceBookingController.updateServiceBooking)
  .delete(serviceBookingController.deleteServiceBooking);

module.exports = router;
