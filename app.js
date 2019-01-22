var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Beach = require("./models/beach");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_beach",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
//we will render ejs
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
console.log(__dirname);
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
            res.render("beaches/index",{beaches: allBeaches});
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
app.get("/beaches/:id/comments/new",function(req,res){
    Beach.findById(req.params.id,function(err, beach){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{beach:beach});
        }
    });
});

app.post("/beaches/:id/comments",function(req, res){
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

app.listen(3000, function(){
    console.log("Serving port 3000!");
});