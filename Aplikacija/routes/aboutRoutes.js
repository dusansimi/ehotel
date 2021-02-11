const express = require('express');
const aboutController = require('../controllers/aboutController');
const authController = require('../controllers/authController');

// ROUTE(/about)

const router = express.Router();

router
  .route('/')
  .get(aboutController.getAbout)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    aboutController.createAbout
  );

router.use(authController.protect, authController.restrictTo('admin'));

router
  .route('/:id')
  .patch(aboutController.updateAbout)
  .delete(aboutController.deleteAbout);

module.exports = router;
