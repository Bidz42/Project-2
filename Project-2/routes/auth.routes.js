const router = require("express").Router();
const bcrypt  = require('bcrypt')
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/checker');

/* GET home page */
router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup')
});

router.post('/signup', isLoggedOut, (req, res, next) => {
const { name, email, password, picture } = req.body

  bcrypt.hash(password, 10)
    .then(hash => {
      return User.create({
        name: name,
        email: email,
        password: hash,
        picture: picture
      })
      .then(user => {
        res.redirect('/auth/login')
      })
    })
});

router.get('/login', isLoggedOut, (req, res, next) => {
  console.log(req.session)
  res.render('auth/login')
});

router.post('/login', isLoggedOut, (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password){
    res.render('auth/login', { errorMessage: 'Please enter data in all fields. '});
    return; 
    }

    User.findOne({ email: email })
    .then(user => {
        if(!user) {
            res.render('auth/login', { errorMessage: 'This email has not been registered.'});
            return;
        }
        else if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/restaurants/restaurants');
        }
        else {
            res.render('auth/login', { errorMessage: 'Incorrect password.' });
            return;
        }
    })
    .catch(err => console.log(err));
});

router.get('/logout', isLoggedIn, (req, res) => {
    res.clearCookie('connect.sid');
    req.session.destroy(() =>{
      res.redirect('/auth/login')
    })
});

module.exports = router;