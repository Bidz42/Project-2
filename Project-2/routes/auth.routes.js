const router = require("express").Router();
const bcrypt  = require('bcrypt')
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/checker');

/* GET home page */
router.get('/signup', isLoggedOut, (req, res) => {
    console.log('req session', req.session);
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
  let theUser

  User.findOne({email: email})
    .then(user => {
      theUser = user
      if (!user) {
        res.send('email not found')
        throw('email not found')
      }
      return bcrypt.compare(password, user.password)
    })
    .then(passwordCorrect => {
      if(!passwordCorrect) {
        res.send('password incorrect')
        return
      }
      req.session.user = theUser
      res.redirect('/restaurants/restaurants')
    })
    .catch(e => {
      next(e)
    })
})

router.get('/logout', isLoggedIn, (req, res, next) => {
  res.clearCookie('connect.sid');
  req.session.destroy(() =>{
    res.redirect('/auth/login')
  })
})

module.exports = router;