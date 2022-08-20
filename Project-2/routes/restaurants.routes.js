const express = require('express');
const router = express.Router();
const User = require ('../models/User.model.js');
const Restaurant = require ('../models/Restaurant.model.js');
const { isLoggedIn, isLoggedOut } = require('../middleware/checker');


//create a restaurant
router.route("/create")
    .get((req, res)=> res.render("restaurants/new-restaurant"))
    .post((req, res) => {
        const { name, cuisine } = req.body;
            Restaurant.create({ name, cuisine })
    .then(()=>{res.redirect("/restaurants/restaurants")})
    .catch((err)=>res.render("restaurants/new-restaurant"))
});

//get all restaurants
router.get("/restaurants", (req, res) => {
  Restaurant.find()
  .then((restaurants) => res.render("restaurants/restaurants", {restaurants}))
  .catch((err) => {
      console.log ((err))
      res.redirect("/")
  })
});

//single restaurants
router.get("/:id", (req, res) => {
    Restaurant.findById(req.params.id)
    .then((restaurants) => res.render("restaurants/restaurant-details", { restaurants }))
    .catch((err) => console.log(err))
});
//delete restaurant
router.post("/:id/delete", (req, res) => {
    const { id } = req.params;
    Restaurant.findByIdAndRemove(id)
    .then(() => res.redirect("/restaurants/restaurants"))
    .catch((err) => console.log(err))
});

router.route("/:id/edit")
    .get((req, res) => {
        const { id } = req.params;
    Restaurant.findById(id)
    .then((restaurants) => {res.render("restaurants/edit-restaurant", {
        restaurants
    })}
    )})
    .post((req, res) => {
const { id } = req.params;
const { user, name, cuisine} = req.body;
Restaurant.findByIdAndUpdate(id, { user, name, cuisine}, {new: true})
.then(() => res.redirect(`/restaurants/restaurants`))
.catch((err) => console.log(err))
});

module.exports = router;