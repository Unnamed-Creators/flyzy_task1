var mongoose = require("mongoose");

var invalidSchema = new mongoose.Schema({
    user:String, 
    Arrival_time:String,
    carrierCode:String,
    Departure_time:String,
    flightCode:String,
    summary:String,
    updated:String,
    id:String,
    status:String,
    organizer:String,
    creator:String,
    attendees:String,
},{
    timestamps:true
});


const UserModel = mongoose.model("Invalid", invalidSchema);

module.exports = UserModel;
