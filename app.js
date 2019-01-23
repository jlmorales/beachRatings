var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Beach = require("./models/beach");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

seedDB();
mongoose.connect("mongodb://localhost/yelp_beach",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
//we will render ejs
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "CS is fun",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//landing page
app.get("/", function(req, res){
    res.render("landing");
});

//INDEX show list of all beaches
app.get("/beaches",function(req, res){
    //res.render("beaches", {beaches: beaches});
    //find all beaches
    Beach.find({},function(err,allBeaches){
        if(err){
            console.log(err);
        }
        else{
            res.render("beaches/index",{beaches: allBeaches, currentUser:req.user});
        }
    });
});


//Create add new Beach to DB
app.post("/beaches", function(req, res){
    //get data from form and add to beaches
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newBeach = {name: name, image: image, description:desc};
    //create new beach and save to DB
    Beach.create(newBeach,function(err, newValue){
    if(err){
        console.log(err);
    }else{
        //redircet to beaches page
        res.redirect("/beaches");
    }
    });
    
    

});
//NEW show form to create new beach
app.get("/beaches/new", function(req, res){
    res.render("beaches/new")
});

//SHOW shows more info about beach
app.get("/beaches/:id",function(req, res){
    //find beach with id
    
    Beach.findById(req.params.id).populate("comments").exec( function(err, foundBeach){
        if(err){
            console.log(err);
        }else{
            //console.log(foundBeach);
            //render show template with foundBeach
            res.render("beaches/show", {beach:foundBeach});
        }
    });
});
//===============
//COMMENT ROUTES
//=============
app.get("/beaches/:id/comments/new",isLoggedIn, function(req,res){
    Beach.findById(req.params.id,function(err, beach){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{beach:beach});
        }
    });
});

app.post("/beaches/:id/comments",isLoggedIn, function(req, res){
    Beach.findById(req.params.id,function(err, beach){
        if(err){
            console.log(err);
            res.redirect("/beaches");
        }else{
            console.log(req.body.comment);
            Comment.create(req.body.comment,function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    beach.comments.push(comment);
                    beach.save();
                    res.redirect('/beaches/'+ beach._id);
                }
            });
        }
    });
    //lookup beach by id
    //reate new comment
    //connect new comment to beach
    //redirect 
});

//==========
//AUTH ROUTES
//=========

//show register form
app.get("/register", function(req, res){
    res.render("register");
});
// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/beaches");
        });
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login");
});
// handle login logic
app.post("/login", passport.authenticate("local", 
{
    successRedirect:"/beaches",
    failureRedirect:"/login"
})  ,function(req, res){
});

//logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/beaches");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
    console.log("Serving port 3000!");
});