const router = require("express").Router();
const bcrypt  = require('bcrypt')
const bcryptSalt = 10;
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/checker');

// =======================ROUTES==============================
router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/signup');
})
  
router.get('/login', isLoggedOut, (req, res, next) => {
    res.render('auth/login')
})
  
// ========================LOGIN==================================
router.post("/login", isLoggedOut, (req, res, next) => {
    const theEmail = req.body.email;
    const thePassword = req.body.password;
  
    if (theEmail === "" || thePassword === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, email and password to sign up."
      });
      return;
    }
  
    User.findOne({ "email": theEmail })
      .then(user => {
        if (!user) {
          res.render("auth/login", {
            errorMessage: "The email doesn't exist."
          });
          return;
        }
        if (bcrypt.compareSync(thePassword, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      })
      .catch(error => {
        next(error);
      })
  });
  
  //=====================SIGNING UP=================================
  
  router.post("/signup", isLoggedOut, (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const img = req.body.img;
  
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
  
    //Field must be filled or Error message pops up
    if (email === "" || password === "" || name === "") {
      res.render("auth/signup", {
        errorMessage: "Must fill all fields"
      });
      return;
    }
  
    //If the user already exists...  Display error message
    User.findOne({ "email": email })
      .then(user => {
        if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The email already exists!"
          });
          return;
        }
  
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
        User.create({
          name,
          email,
          password: hashPass,
          img,
        })
          .then(() => {
            res.redirect("/auth/login");
          })
          .catch(error => {
            console.log(error);
          })
      })
      .catch(error => {
        next(error);
      })
  })

 //=====================LOG OUT=================================
router.get("/logout", isLoggedIn, (req, res, next) => {
    req.session.destroy((err) => {
      // can't access session here
      res.redirect("/auth/login");
    });
  });

module.exports = router;