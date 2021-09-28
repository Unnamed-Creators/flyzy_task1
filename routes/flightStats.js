const express =require('express');
const route=express.Router();;
const {google} =require("googleapis")
const dateBase =require('nedb');
const db = new dateBase({ filename: 'data/data.db' });
const db1= new dateBase({ filename: 'data/verified_flights.db' });
const db2 = new dateBase({ filename: 'data/unverified_flights.db' });
const datax =require("../data.json");
const {OAuth2}=google.auth
const oAuth2Client=new OAuth2(process.env.clientId,process.env.clientSecret);
const axios =require("axios");
db.loadDatabase(function (err) {    // Callback is optional
    if(err)
        return  console.log(err,"error while savinf in nedb");
    return  console.log("Saved");
})
const axiosFlightStats=require("../utils");


route.post('/get',async (req,res,next)=>{
    // let data =await axiosFlightStats("schedules","rest","json","v1","SS","890",2021,9,1,"id","key").get("");
    let data=await axios.get("https://jitul.free.beeceptor.com");
    
    if(true){
        db1.insert()
    }else{
        db2.insert()
    }
    
})

route.post("/testing",async(req,res,next)=>{
    // let data =await axiosFlightStats().get("");
    console.log(datax);
    
}); 

module.exports=route;
