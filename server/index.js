const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy
const dotenv = require('dotenv');
const multer = require("multer")

const User = require('./models/userModel')
const messageModel = require('./models/messageModel')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "files/")
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now()+ '-' + Math.round(Math.random(), 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
const upload = multer({storage:storage});

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
const { getAllUsersExceptCurrentUser, sendFriendRequest, getCurrentUserSentFriendReqs, acceptFriendRequest, getFriendsOfUser, sendMessageToFriend, getChatRoomUserDetails, getMessagesOfUsers, userSentFriendRequests, userFriends } = require("./controllers/userController");



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

// auth routes
app.post("/register",register)
app.post("/login",login)

// user routes
app.get("/users/:userId", getAllUsersExceptCurrentUser)
app.post("/friend-request", sendFriendRequest)
app.get("/friend-request/:userId", getCurrentUserSentFriendReqs)
app.post("/friend-request/accept", acceptFriendRequest);
app.get("/accepted-friends/:userId",getFriendsOfUser)
app.post("/messages",
//  upload.single("imageFile"),
 sendMessageToFriend);
app.get('/user/:userId', getChatRoomUserDetails)
app.get('/user/:senderId/:receipentId', getMessagesOfUsers)
 
// friend status routes
app.get("/friend-requests/sent/:userId", userSentFriendRequests)
app.get("/friends/:userId", userFriends)