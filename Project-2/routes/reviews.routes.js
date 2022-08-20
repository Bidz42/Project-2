const express = require('express');
const router = express.Router();
const bcrypt  = require('bcrypt')
const Review = require('../models/User.model');

// Navigate inside create

router.get('/:id/create', (req, res) => {
    const id = req.query;
    res.render('reviews/create', {id});
  });

// Create a new Review

router.post('/:id/create', (req, res) => {
    let id = req.query;
    const user = id;
    const {comment, star } = req.body;

    if (!user || !comment || !star) {
            res.render('reviews/create', { errorMessage: 'Missing fields' });
        return
        }

    Review.create({ 
        user: user,
        comment: comment,
        star: star 
        })
        .then( comment => {
            res.redirect('restaurants/restaurants');
        })
        .catch((err) => {
            res.render('reviews/create', { errorMessage: err });
        });
});

// List all reviews in the database

router.get("/list", (req, res)=>{
    
    Review.find()
        .populate(user)
        .then(comments =>{
            res.render("reviews/list", {comments})
        })
})

// edit an existing review

router.get("/:id/edit", (req,res)=>{
    const id = req.query;
    
    Review.findById(id)
        .populate(user)
        .then(review =>{
            res.render("reviews/edit", {review})
        })

})

router.post("/:id/edit", (req, res)=>{
    const {user, comment, star } = req.body;


    Review.findOneAndUpdate({user:user}, {user, comment, star}, {new: true})
        .then(result =>{
            res.redirect("reviews/list")
        })

})


module.exports = router;