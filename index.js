require("dotenv").config();
const express=require("express");
const routes =require('./routes');
const app=express();
const PORT=process.env.PORT||8080;
const connectDB = require("./connect.js");
connectDB();
// middleware;
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// routes
app.use("/",routes);

app.listen(8080,()=>{
    console.log("listening to port ",PORT)
})


