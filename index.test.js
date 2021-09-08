//List the events in the calendar of the user
 
const { google } = require('googleapis')
const route = require('express').Router()
const { oAuth2Client } = require('../../config/oauth_client_config')
const admin = require("../../config/db_connect")
const db=admin.firestore()
const axios = require('axios')
//const { firebase } = require('googleapis/build/src/apis/firebase')
 
 
route.post('/',async (req,res)=>{
  try{
    oAuth2Client.setCredentials({
        refresh_token: req.body.refresh_token,
      }) 
      //Using google calendar API to list the events of associated with the calendar
      let arr = []
      let id = []
    const calendar = google.calendar({version: 'v3', auth:oAuth2Client});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: '2020-12-01T07:06:40.372Z',
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    }, async (err, result) => {
      if (err) {
          console.log('The API returned an error: ' + err);
          res.status(500).send({"Error":"Something went wrong while getting events from users calendar"})
    } 
      const events = result.data.items;
      const snapshot = await db.collection('user_refresh_tokens').where('refresh_Token','==',req.body.refresh_token).get()
      var email="xyz"
      snapshot.forEach(async (doc) => {
        email = doc.data().email
      });
      //Updates the events associated with the users's email which containt certain keywords
      for(var i=0;i<events.length;i++){
          const event = events[i]
        if(event.summary.includes("Flight")){
            const summary2  = event.summary 
            const start = event.summary.indexOf('(')+1
            const end = event.summary.length-1;
            var str = event.summary.substring(start,end)
            const split = str.indexOf(' ')    
            const carrrierCode1 = str.substring(0,split)
            const flightCode1 = str.substring(split+1,str.length)     
            const data = {
              Arrival_time:event.start.dateTime,
              carrierCode:carrrierCode1,
              email:email,
              Departure_time: event.start.dateTime,
              flightCode:flightCode1,
              summary:summary2,
              updated:true,
              id:event.id
            }  
           // console.log(data)
            const snapshot2 = await db.collection('user_events').doc(event.id).get()
            if(!snapshot2.exists) arr.push(data)
          }
      }
   // console.log(arr)
    const arr2 = JSON.stringify(arr)
   console.log(arr2)
    var config = {
      method: 'post',
      url: 'https://us-central1-flyzydev.cloudfunctions.net/flight/addFlightFromCalender',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : arr2
    }
  // console.log(arr2)
   const resp = await axios(config)
   console.log("data",resp.data)
   //console.log(resp.data)
    for(var i=0;i<resp.data.length;i++){
     // console.log(resp.data[i])
      if(resp.data[i].success===true){
              await db.collection('user_events').doc(resp.data[i].id).set({
              Arrival_time:resp.data[i].Arrival_time,
              carrierCode:resp.data[i].carrierCode,
              email:resp.data[i].email,
              Departure_time: resp.data[i].Departure_time,
              flightCode:resp.data[i].flightCode,
              summary:resp.data[i].summary,
              updated:resp.data[i].updated
          })  
    }
  }
      res.send(events)
    })
  }
  catch(err){
    res.status(500).send({"Error":"Something went wrong while getting events from users calendar"})
  }
})
 
module.exports = route