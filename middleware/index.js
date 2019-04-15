const Campground = require("../models/campground");
const Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
   if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground) {
         if(err) {
             req.flash("error", "Campground not found!");           
            res.redirect("back");
         } else {
            if(foundCampground.author.id.equals(req.user._id)) {
               next();
            } else {
               req.flash("error", "You dont have permission");               
               res.redirect("back");
            };
         };
      });
   } else {
      req.flash("error", "You need to be logged in!");      
      res.redirect("back");
   };
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
   if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, commentFound) {
         if(err) {
            req.flash("error", "Campground not found!");
            res.redirect("back");
         } else {
            if(commentFound.author.id.equals(req.user._id)) {
               next()
            } else {
               req.flash("error", "You dont have permission!");
               res.redirect("back");
            }
         }
      })
   } else {
      req.flash("error", "You need to be logged in!");
      res.redirect("back");
   }
}

middlewareObj.isLoggedin = function(req, res, next) {
   if(req.isAuthenticated()) {
      return next()
   } 
   req.flash("error", "Please login first!");
   res.redirect("/login")
}

module.exports = middlewareObj;