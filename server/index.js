const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy
const dotenv = require('dotenv');

const User = require('./models/userModel')
const messageModel = require('./models/messageModel')


const app=express();
const port= process.env.PORT || 4000;
const cors = require("cors");
app.use(cors());
dotenv.config()
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");
const { register, login } = require("./controllers/authController");


mongoose.connect(
    process.env.MONGO_URI,
    {
    useNewUrlParser:true,
    useUnifiedTopology:true
    }
).then(()=>{
    console.log("\n\t Connected to MongoDB");
}).catch((error)=>{
    console.log("\n\t Error connecting to MongoDB",error)
});
app.listen(port,()=>{
    console.log("\n\t Server running on port : 4000  ")
})

app.get("/",(req,res)=>{
    res.send("\n\t hi from native chat");
       
})


app.post("/register",register)


app.post("/login",login)
