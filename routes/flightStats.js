const express = require("express");
const route = express.Router();
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const oAuth2Client = new OAuth2(process.env.clientId, process.env.clientSecret);
const axios = require("axios");
const Calender = require("../model/calander");
const Schedule = require("../model/schedule");
const Invalid = require("../model/invalid");
const axiosFlightStats = require("../utils");

route.post("/check", async (req, res, next) => {
  let checkData = await Calender.findOne({
    Arrival_time: "2021-05-04T11:35:00+05:30",
  });

  let dateNow = new Date(checkData.Arrival_time.split("T")[0]);
  let lastDate = new Date(dateNow.setFullYear(dateNow.getFullYear() - 1));
  let cityName = checkData.summary.split(" ")[2];
  let protocol = "json";
  let service = "schedule";

  /**
   * @Assumed_Steps
   * assumeing we have requested in this format using the above parameters sets
   *  */

  /**
   * @API_Link
   * `https://api.flightstats.com/flex/${service}/${protocol}/${version}/${dataFormat}/flight/${checkData.carrierCode}/${checkData.flightCode}/departing/${checkData.Arrival_time.split("T")[0].split("-")[0]}/${checkData.Arrival_time.split("T")[0].split("-")[1]}/${checkData.Arrival_time.split("T")[0].split("-")[2]}}?appId=${id}&appKey=${key}`
   */

  /**
   * @API_Call
   * apiData=await axios.get("https://jitul.free.beeceptor.com");
   * then use the api data to get the extarct required using the city of arrivial
   * flight code, carrierCode , year,day and month and save them is valid db
   * if not found save in invaid
   *
   */
  // for now recieve and save data

  let apiData = await axios.get("https://jitul1.free.beeceptor.com");

  let cityInfo = apiData.data.appendix.airports.find((item) => {
    if (item.city == cityName) {
      return item;
    }
  });
  let flightInfo = apiData.data.scheduledFlights.find((item) => {
    console.log(
      item.arrivalAirportFsCode == cityInfo.fs &&
        item.carrierFsCode == checkData.carrierCode &&
        item.flightNumber == checkData.flightCode
    );
    console.log(
      item.arrivalAirportFsCode,
      item.carrierFsCode,
      item.flightNumber
    );
    if (
      item.arrivalAirportFsCode == cityInfo.fs &&
      item.carrierFsCode == checkData.carrierCode &&
      item.flightNumber == checkData.flightCode
    ) {
      return item;
    }
  });
  let data = await Schedule.findOne({
    arrivalTime: flightInfo.arrivalTime,
  });

  if (!data) {
    await Schedule.create({
      carrierFsCode: flightInfo.carrierFsCode,
      flightNumber: flightInfo.flightNumber,
      departureAirportFsCode: flightInfo.departureAirportFsCode,
      arrivalAirportFsCode: flightInfo.arrivalAirportFsCode,
      departureTime: flightInfo.departureTime,
      arrivalTime: flightInfo.arrivalTime,
      flightEquipmentIataCode: flightInfo.flightEquipmentIataCode,
      serviceType: flightInfo.serviceType,
      serviceClasses: flightInfo.serviceClasses,
      trafficRestrictions: flightInfo.trafficRestrictions,
    });
  }

  if (apiData.status == 200) {
    res.json({ message: "done" }).status(200);
  } else {
    res.json({ message: "somthing went wrong" }).status(500);
  }
});

route.post("/testing", async (req, res, next) => {
  let dat = await Calender.findOne({ user: "jitulteron9@gmail.com" });
  res.json({ data: dat });
});

module.exports = route;
