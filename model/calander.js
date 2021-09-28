var mongoose = require("mongoose");

var calanderSchema = new mongoose.Schema({
    user:String, 
    Arrival_time:{
        type:String,
        unique:true
    },
    Departure_time:{
        type:String,
        unique:true
    },
    carrierCode:String,
    flightCode:String,
    summary:String,
    updated:Boolean,
    id:String,
    status:String,
    organizer:Object,
    creator:Object,
    attendees:Array,
},{
    timestamps:true
});


const UserModel = mongoose.model("Calander", calanderSchema);

module.exports = UserModel;
