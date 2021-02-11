const express = require('express');
const serviceController = require('../controllers/serviceController');
const authController = require('../controllers/authController');

// ROUTE(/services)

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(serviceController.getAllServices)
  .post(
    authController.restrictTo('admin', 'staff'),
    serviceController.createService
  );

router
  .route('/:id')
  .get(serviceController.getService)
  .patch(
    authController.restrictTo('admin', 'staff'),
    serviceController.updateService
  )
  .delete(
    authController.restrictTo('admin', 'staff'),
    serviceController.deleteService
  );

module.exports = router;
