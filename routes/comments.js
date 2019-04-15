const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//comment new
router.get("/new", middleware.isLoggedin, function(req, res) {
   Campground.findById(req.params.id, function(err, campground){
      if(err){
         console.log("message");
      } else {
         res.render("comments/new", {campground: campground});
      }
   });
});

//comment create
router.post("/", middleware.isLoggedin,  function(req, res){
   Campground.findById(req.params.id, function(err, campground){
      if(err){
         console.log("message");
      } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
               req.flash("error", "something went wrong");         
               console.log("message");
            } else {
               //adding author
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
                     req.flash("success", "added comment");
               res.redirect("/campgrounds/" + campground._id);
            };
         });
      };
   });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res) {
   console.log(req.params.comment_id);
   Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err) {
         res.redirect("back");
     } else {
         res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
     };
   });  
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, editComment) {
      if(err) {
         res.redirect("back");
      } else {
         res.redirect("/campgrounds/" + req.params.id );
      };
   });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err, deleteComment) {
      if(err){
          res.redirect("back");
      } else {
         req.flash("success", "comment deleted");
         res.redirect("back");
      }
   });
});


module.exports = router;