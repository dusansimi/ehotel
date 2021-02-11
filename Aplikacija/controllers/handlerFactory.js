const APIFeatures = require('../utillities/apiFeatures');
const AppError = require('../utillities/appError');
const catchAsync = require('../utillities/catchAsync');

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: {
        doc
      }
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      data: {
        doc
      }
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(
      Model.findById(req.params.id),
      req.query
    ).limitFields();

    const doc = await features.query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'sucess',
      data: {
        doc
      }
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(201).json({
      status: 'sucess',
      data: {
        doc
      }
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);
    res.status(202).json({
      status: 'sucess',
      data: null
    });
  });
