const router = require("express").Router();
const bcrypt  = require('bcrypt')
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/checker');





module.exports = router;