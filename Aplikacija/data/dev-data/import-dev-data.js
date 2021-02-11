const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Room = require('../../models/roomModel');
const Price = require('../../models/priceModel');
const Service = require('../../models/serviceModel');

dotenv.config({ path: `${__dirname}/../../config.env` });

//BAZA PODATAKA
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to database!'));

const rooms = JSON.parse(
  fs.readFileSync(`${__dirname}/roomData.json`, 'utf-8')
);

const prices = JSON.parse(
  fs.readFileSync(`${__dirname}/priceData.json`, 'utf-8')
);

const services = JSON.parse(
  fs.readFileSync(`${__dirname}/serviceData.json`, 'utf-8')
);
//importing data
const importRoomData = async () => {
  try {
    await Room.create(rooms);
    console.log('Data loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const importPriceData = async () => {
  try {
    await Price.create(prices);
    console.log('Data loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const importServiceData = async () => {
  try {
    await Service.create(services);
    console.log('Data loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//delete all data from collection
const deleteRoomData = async () => {
  try {
    await Room.deleteMany();
    console.log('Data deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deletePriceData = async () => {
  try {
    await Price.deleteMany();
    console.log('Data deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteServiceData = async () => {
  try {
    await Service.deleteMany();
    console.log('Data deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//EXEC
const arg1 = process.argv[2];
const arg2 = process.argv[3];
if (arg1 === '--import') {
  if (arg2 === '--room') importRoomData();
  if (arg2 === '--price') importPriceData();
  if (arg2 === '--service') importServiceData();
} else if (arg1 === '--delete') {
  if (arg2 === '--room') deleteRoomData();
  if (arg2 === '--price') deletePriceData();
  if (arg2 === '--service') deleteServiceData();
}
