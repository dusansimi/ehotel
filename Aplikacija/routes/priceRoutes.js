const express = require('express');
const priceController = require('../controllers/priceController');
const authController = require('../controllers/authController');

// (/prices)
const router = express.Router();

router
  .route('/')
  .get(priceController.getAllPrices)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    priceController.createPrice
  );

router.use(authController.protect);

router
  .route('/:id')
  .get(priceController.getPrice)
  .patch(
    authController.restrictTo('admin', 'staff'),
    priceController.updatePrice
  )
  .delete(
    authController.restrictTo('admin', 'staff'),
    priceController.deletePrice
  );

module.exports = router;
