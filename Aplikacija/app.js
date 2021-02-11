const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utillities/appError');
const globalErrorHandler = require('./controllers/errorController');

//OVDE IDE REQUIRE ZA ROUTERI
const roomRouter = require('./routes/roomRoutes');
const priceRouter = require('./routes/priceRoutes');
const userRouter = require('./routes/userRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const aboutRouter = require('./routes/aboutRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const roomBookingRouter = require('./routes/roomBookingRoutes');
const serviceBookingRouter = require('./routes/serviceBookingRoutes');

const app = express();

app.use(cors());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
//MIDDLEWARE
//dodaje security http headeri
app.use(helmet());

//ispisuje zahtevi u konzolu
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//omogucava da parsujemo request (da ima req.body)
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss atacks
app.use(xss());

//OVDE ROUTES
app.use('/api/rooms', roomRouter);
app.use('/api/prices', priceRouter);
app.use('/api/users', userRouter);
app.use('/api/services', serviceRouter);
app.use('/api/about', aboutRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/roombookings', roomBookingRouter);
app.use('/api/servicebookings', serviceBookingRouter);

//ERROR HANDLING
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
