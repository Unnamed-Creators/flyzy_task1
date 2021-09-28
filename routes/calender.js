const express = require("express");
const route = express.Router();
const { google } = require("googleapis");
const Calender = require("../model/calander");
const Schedule = require("../model/schedule");
const Invalid = require("../model/invalid");
const { OAuth2 } = google.auth;
const oAuth2Client = new OAuth2(process.env.clientId, process.env.clientSecret);
oAuth2Client.setCredentials({
  refresh_token: process.env.refreashToken,
});
const calender = google.calendar({ version: "v3", auth: oAuth2Client });

route.post("/", async (req, res, next) => {
  try {
    // you can also send your own refreash token from the body parser;
    const { noOfResults, minTime, maxTime, email } = req.body;

    calender.events.list(
      {
        calendarId: "primary",
        // timeMin: (new Date(minTime)).toISOString(),
        // timeMax:(new Date(maxTime)).toISOString(),
        maxResults: noOfResults,
        singleEvents: true,
        orderBy: "startTime",
      },
      (err, res) => {
        if (err) return console.log("The API returned an error: " + err);

        const events = res.data.items;

        events.map(async (event) => {
          if (event.summary.includes("Flight")) {
              console.log(event,"event");
            const summary = event.summary;
            const start = event.summary.indexOf("(") + 1;
            const end = event.summary.length - 1;
            var str = event.summary.substring(start, end);
            const split = str.indexOf(" ");
            const carrrierCode1 = str.substring(0, split);
            const flightCode1 = str.substring(split + 1, str.length);
            let check=await Calender.find({
                Arrival_time:event.start.dateTime,
                Departure_time: event.start.dateTime,
            })
            if(check.length>0){
                return
            }
            await Calender.create({
              user: email,
              Arrival_time: event.start.dateTime,
              carrierCode: carrrierCode1,
              Departure_time: event.start.dateTime,
              flightCode: flightCode1,
              summary: summary,
              updated: true,
              id: event.id,
              status: event.status,
              organizer: event.organizer,
              creator: event.creator,
              attendees: event.attendees,
            });
          }
        });
      }
    );
    res.json({ message: "received" }).status(200);
  } catch (err) {
    res.json({ error: err }).status(400);
  }
});

route.post("/get", async (req, res, next) => {
  await db.find({ user: req.body.email }, (err, data) => {
    if (err)
      return res.status(400).json({
        message: "something went wrong",
      });
    return res.status(200).json({
      data: data,
    });
  });
});

module.exports = route;
