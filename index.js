require("dotenv").config();
const express=require("express");
const {google} =require("googleapis")
const {OAuth2}=google.auth
const oAuth2Client=new OAuth2();
const app=express();
const PORT=process.env.PORT||8080;

// middleware;
app.use(express.json());
app.use(express.urlencoded());

// routes
app.get("/",(req,res,next)=>{
    res.json({message:"done"}).status(200);
})

app.listen(8080,()=>{
    console.log("listening to port ",PORT)
})


