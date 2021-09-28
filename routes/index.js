const express =require('express');
const route=express.Router();
const calender=require('./calender');
const flightStats=require('./flightStats');

route.use("/calender",calender)
route.use("/flightStats",flightStats)

module.exports=route;