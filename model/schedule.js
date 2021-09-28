var mongoose = require("mongoose");

var scheduleSchema = new mongoose.Schema({
    carrierFsCode:String,
  flightNumber:String,
  departureAirportFsCode:String,
  arrivalAirportFsCode:String,
  departureTime:String,
  arrivalTime:String,
  flightEquipmentIataCode:String,
  serviceType:String,
  serviceClasses: Array,
  trafficRestrictions: Array,
},{
    timestamps:true
});


const ScheduleModel = mongoose.model("Schedule", scheduleSchema);

module.exports = ScheduleModel;
