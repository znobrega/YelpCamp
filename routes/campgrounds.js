const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");


router.get("/", (req, res) => {
   Campground.find({}, (err, campgrounds) => {
      if(err){
         console.log(err);
      } else {
         res.render("campgrounds/index", {campgrounds:campgrounds, currentUser: req.user});
      }
   });
});

router.post("/", middleware.isLoggedin, (req, res) => {
  let imageName = req.body.imageName;
  let imageUrl = req.body.imageUrl;
  let imageDescription = req.body.imageDescription;
  let price = req.body.price;
  let author = {
      id: req.user._id,
      username: req.user.username
  }
  let newCamp = {name: imageName, price: price, image: imageUrl, description: imageDescription, author: author};
  //campgrounds.push({name: imageName, image: imageUrl});
  Campground.create(newCamp, (err, newCampground) =>  {
      if(err){
         console.log(err);
      } else {
         console.log("CREATED");
         res.redirect("/campgrounds");
      }
   });
});

router.get("/new", middleware.isLoggedin, (req,res) => {
  res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
      if (err){
         console.log(err);
      } else {
         res.render("campgrounds/show", {campground: foundCampground});
      };
   }); 
});

//EDIT ROUTES
//=================

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){   
   Campground.findById(req.params.id, function(err, foundCampground) {
      res.render("campgrounds/edit", {campground: foundCampground});                
   });
});

//UPDATE ROUTES
//================
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res,){  
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated) {
      if(err) {
         res.redirect("/campgrounds")
      } else {
         res.redirect("/campgrounds/"+ req.params.id);
      };
   });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err, deleted) {
      if(err){
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds");
      };
   });
});

module.exports = router;