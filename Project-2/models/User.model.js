const { Schema, model } = require("mongoose");
const {isEmail} = require('validator');

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Must include username"]
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Must include email"],
    index: true,
    validate: [isEmail, "Invalid email"]
  },
  password: {
    type: String,
    required: [true, "Must include password"]
  },
  picture: {
    type: String,
  }
}, {minimize: false});

const User = model('User', UserSchema);

module.exports = User
