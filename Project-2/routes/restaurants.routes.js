const router = require("express").Router();
const User = require('../models/User.model');
const Restaurant = require('../models/Restaurant.model');
const Review = require('../models/Review.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/checker');

router.get('/restaurants', isLoggedIn, (req, res) => {
    if(req.session.user){
      res.render('restaurants/restaurants')
    }
    else {
      res.render('auth/login')
    }
});


module.exports = router;