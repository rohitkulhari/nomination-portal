const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: ['true', 'please enter your name'],
    },
    email: {
      type: String,
      unique: true,
      required: ['true', 'Please enter the email'],
      validate: [validator.isEmail, 'This is not a valid email'],
      validate: {
        validator: function (el) {
          let i = el.indexOf('@');
          let domain = el.substring(i + 1);
          return domain === 'iitk.ac.in';
        },
        message: 'Not an iitk email id',
      },
    },
    phoneNo: {
      type: Number,
      validate: {
        validator: function (el) {
          return el >= 1000000000 && el <= 9999999999;
        },
        message: 'Enter a 10 digit number',
      },
    },
    address: {
      type: String,
    },
    Rollno: { type: Number },
    post: { type: String },
    photo: {
      type: String,
    },
    signature: {
      type: String,
    },
    role: {
      type: String,
      default: 'campaigner',
      require: [true, 'Please enter valid role'],
      enum: {
        values: ['campaigner', 'proposer', 'seconder', 'admin', 'candidate'],
        message: 'Invalid input',
      },
    },
    password: {
      type: String,
      required: [true, 'Please Enter a password'],
      select: false,
    },
    confirmPassword: {
      type: String,
      select: false,
      required: true,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'password and passwordconfirm not same',
      },
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    passwordToken: String,
    tokenExpire: Date,
    active: {
      type: Boolean,
      default: false,
    },
    worksFor: {
      type: mongoose.Schema.ObjectId,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    remark: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
schema.methods.correctPassword = async function (
  currentpassword,
  userpassword
) {
  return bcrypt.compare(currentpassword, userpassword);
};
schema.methods.changepassword = async function (time) {
  if (this.changedpasswordat) {
    let temp = parseInt(this.changedpasswordat.getTime() / 1000, 10);
    return time < temp;
  }
  return false;
};
schema.methods.setToken = async function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.tokenExpire = Date.now() + 30 * 60 * 1000;
  return token;
};
const modle = mongoose.model('candidates', schema);
module.exports = modle;
