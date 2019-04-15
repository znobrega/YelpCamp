const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const middleware = require("../middleware");

//root rout
router.get("/", (req, res) => {
  res.render("landing");
});

//show register
router.get("/register", function(req, res){
   res.render("register");
});

router.post("/register", function(req, res){
   //passport local mongoose
   let newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
      if(err){
         req.flash("error", err.message);
         return res.render("register");
      } 
      passport.authenticate("local")(req,res,function(){
         req.flash("success", "Welcome to yelp " + user.username);
         res.redirect("/campgrounds");
      })
  }); 
});

//SHOW FORM
router.get("/login", function(req,res){
   req.flash("error", "Please login first");
   res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
   {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
   }), function(req, res) {

});

//LOGOUT THING
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged out");
   res.redirect("/campgrounds");
});

module.exports = router;