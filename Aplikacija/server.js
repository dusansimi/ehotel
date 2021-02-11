const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! exiting...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');

//POVEZIVANJE NA BAZU
const conString = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(conString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to Database!');
  });

//STARTOVANJE SERVERA
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`API running on port: ${port}`);
});

//ZA GRESKE VAN EXPRESS APP
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! exiting...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
