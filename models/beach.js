var mongoose = require("mongoose");
//DEFINE OUR SCHEMA
var beachSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});
module.exports = mongoose.model("Beach", beachSchema);
