require("dotenv").config();
const express=require("express");
const {google} =require("googleapis")
const dateBase =require('nedb');
const db = new dateBase({ filename: 'data/data.db' });
const {OAuth2}=google.auth
const oAuth2Client=new OAuth2(process.env.clientId,process.env.clientSecret);
db.loadDatabase(function (err) {    // Callback is optional
    if(err)
        return  console.log(err,"error while savinf in nedb");
    return  console.log("Saved");
})

const app=express();
const PORT=process.env.PORT||8080;

// middleware;
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// routes
app.post("/",(req,res,next)=>{
    // you can also send your own refreash token from the body parser;
    const {noOfResults,minTime,maxTime,email}=req.body
    oAuth2Client.setCredentials({
        refresh_token: process.env.refreashToken
    })
    let dataArray=[];
    let  data=[];
    const calender =google.calendar({version:"v3",auth:oAuth2Client});
    
    calender.events.list({
        calendarId: 'primary',
        // timeMin: (new Date(minTime)).toISOString(),
        // timeMax:(new Date(maxTime)).toISOString(),
        maxResults:noOfResults,
        singleEvents: true,
        orderBy: 'startTime',
    },(err,res)=>{
        if (err) return console.log('The API returned an error: ' + err);

    const events = res.data.items;
    
    events.map(event=>{
        
        if(event.summary.includes("Flight")){
            
            const summary = event.summary;
            const start = event.summary.indexOf('(')+1
            const end = event.summary.length-1;
            var str = event.summary.substring(start,end)
            const split = str.indexOf(' ')    
            const carrrierCode1 = str.substring(0,split)
            const flightCode1 = str.substring(split+1,str.length) 
    
             data = {
                user:email, 
                Arrival_time:event.start.dateTime,
                carrierCode:carrrierCode1,
                Departure_time: event.start.dateTime,
                flightCode:flightCode1,
                summary:summary,
                updated:true,
                id:event.id,
                status:event.status,
                organizer:event.organizer,
                creator:event.creator,
                attendees:event.attendees,
              }
              
            db.insert(data);
            
              
        }
    })
}); 

   res.json({message:"done"}).status(200);
});

app.post('/get',async (req,res,next)=>{

    await db.find({user:req.body.email},(err,data)=>{
        if(err) return res.status(400).json({
            message:"something went wrong",
        });
        return res.status(200).json({
            data:data,
        });
        
    });  
})

app.listen(8080,()=>{
    console.log("listening to port ",PORT)
})


