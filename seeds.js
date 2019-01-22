var mongoose = require("mongoose");
var Beach = require("./models/beach");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Fire Island", 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Chubut-PuntaTombo-P2220157b-small.jpg/135px-Chubut-PuntaTombo-P2220157b-small.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Robert Moses", 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Arniston_01.JPG/180px-Arniston_01.JPG",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Stony brook", 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Kids_Zanzibar-2.jpg/180px-Kids_Zanzibar-2.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all Beachs
   Beach.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Beachs!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few Beachs
            data.forEach(function(seed){
                Beach.create(seed, function(err, beach){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a Beach");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    beach.comments.push(comment);
                                    beach.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;