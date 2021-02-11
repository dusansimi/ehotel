const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  role: {
    type: String,
    enum: ['user', 'staff', 'admin'],
    default: 'user'
  },
  inHotel: {
    type: Boolean,
    default: false
  },
  inRoom: {
    type: Number
  },
  password: {
    type: String,
    required: [true, 'Please provide password longer than 8 characters'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

//Enkriptuje sifru pre cuvanja u bazu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//Postavalja u bazu datum poslednje izmene sifre
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  //Oduzimamo sekundu da bi bili sigurni da je novi token validan
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//da ne prikazuje neaktivne korisnike
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//metoda za proveru validnosti sifre
userSchema.methods.correctPassword = async function (candidatePass, pass) {
  return await bcrypt.compare(candidatePass, pass);
};

//da li je token izdat nakon poslednje promene sifre
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

//u bazu se cuva enkriptovan token, dok se korisniku salje normalan
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
