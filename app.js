const express     = require("express"),
      app         = express(),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      flash       = require("connect-flash"),
      passport    = require("passport"),
      methodOverride = require("method-override"),
      LocalStrategy = require("passport-local")
      Campground  = require("./models/campground"),
      Comment     = require("./models/comment"),
      User        = require("./models/user"),
      seedDB      = require("./seeds");


const PORT = process.env.PORT || 3000;

// Requiring routes
const commentRoutes     = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes       = require("./routes/index");

//let url = process.env.DATABASE || "mongodb://localhost/yelp_camp" || "mongodb://carlosnobrega:yelp123@ds023458.mlab.com:23458/znyelpcamp"
let url = "mongodb://carlosnobrega:yelp123@ds023458.mlab.com:23458/znyelpcamp"
mongoose.connect(url, { useNewUrlParser: true }); 
//mongoose.connect("mongodb://uset:password@asdas.mlab.com:55432/yeplcamp")
//process.env.databaseURL
//PARA NODE:
//google cloud
//digital ocean
//PHP ou WORDPRESS:
//hostgator 
//
//git revert --no-commit 2131256890..HEAD
//git commit

 //seedDB();// seed the database
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
   secret: "Interestellar",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, function(){
  console.log("working");
});

/*
https://wallhalla.com/thumbs/preview/4/463dAKeF7AO.jpg
https://wallhalla.com/thumbs/preview/7/74dMyedWHwOA.jpg
https://wallhalla.com/thumbs/preview/d/DaPr15YWU980.jpg
https://wallhalla.com/thumbs/preview/o/o6q4PaO3I1dz.jpg
https://wallhalla.com/thumbs/preview/n/Np7oNawuBwY.jpg
https://wallhalla.com/thumbs/preview/q/Q74y9gwFAJv.jpg
https://wallhalla.com/thumbs/preview/v/v7wp0BKub93.jpg
https://wallhalla.com/thumbs/preview/e/EbnAPMvHLp.jpg

// let campgrounds = [
//         {name: "Salmon Creek", image: "https://wallhalla.com/thumbs/preview/1/1nrqokEOF9Ax.jpg"},
//         {name: "Granite Hill", image: "https://wallhalla.com/thumbs/preview/e/eonk8zbPi7Y3.jpg"},
//         {name: "Mountain Grills", image: "https://wallhalla.com/thumbs/preview/b/BDEBQY0YtNgP.jpg"},
//         {name: "Salmon Creek", image: "https://wallhalla.com/thumbs/preview/1/1nrqokEOF9Ax.jpg"},
//         {name: "Granite    Hill", image: "https://wallhalla.com/thumbs/preview/e/eonk8zbPi7Y3.jpg"},
//         {name: "Mountain Grills", image: "https://wallhalla.com/thumbs/preview/b/BDEBQY0YtNgP.jpg"}
//     ]

RESTFULL ROUTES 


NAME        URL          VERB          DESC
===================================================================
INDEX       /dogs          GET         SHOW THE DOGS
NEW         /dogs/new      GET         SHOW THE FORM TO ADD NEW DOGS
CREATE      /dogs          POST        ADD THE DOG FROM THE FORM
SHOW        /dogs/:id      GET         SHOW DOG INDIVIDUALLY
EDIT FORM   /dogs/:id/edit GET
EDIT        /dogs/:id      PUT
DELETE      /dogs/:id      DELETE

*/

