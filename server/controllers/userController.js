const User = require('../models/userModel')
const Message = require("../models/messageModel")

// controller to get all the users except current user
const getAllUsersExceptCurrentUser = (req, res) => {
    console.log("getAllUsersExceptCurrentUser")
    const loggedinUserId = req.params.userId;

    User.find({ _id: { $ne: loggedinUserId } }).then((users) => {
        res.status(200).json(users)
    }).catch((err) => {
        console.log("error retrieving users")
        res.status(200).send(err)
    })
}

// controller to send a request to a user
const sendFriendRequest = async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        // update the receipents friendRequests array
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { friendRequests: currentUserId }
        })

        // update the sender's sent FriendRequests array
        await User.findByIdAndUpdate(currentUserId, {
            $push: { sentFriendRequests: selectedUserId }
        })

        res.sendStatus(200);

    } catch (error) {
        res.sendStatus(500);
    }
}

//controller to accept a friendRequest
const acceptFriendRequest = async (req, res) => {
    console.log("accept frnd request got hit")
    const { receipentId, senderId } = req.body

    // retrieve the documents of sender and the receiver
    const sender = await User.findById(senderId);
    const receipent = await User.findById(receipentId)

    try {
        sender.friends.push(receipentId);
        receipent.friends.push(senderId);

        receipent.friendRequests = receipent.friendRequests.filter((request) => request.toString() !== senderId.toString());

        sender.friendRequests = sender.sentFriendRequests.filter((request) => request.toString() !== receipentId.toString())

        sender.save();
        receipent.save();

        res.status(200).json({ message: "Friend request accepted" })
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }



}

// controller to show all the friendRequests sent by current userid
const getCurrentUserSentFriendReqs = async (req, res) => {
    try {
        const { userId } = req.params

        // fetch the user document based on the user id
        const user = await User.findById(userId).populate("friendRequests", "name email image").lean();
        const friendRequests = user.friendRequests;
        res.json(friendRequests);
    } catch (error) {
        res.sendStatus(500);
    }
}

// controller to get all the friends of loggedin user
const getFriendsOfUser = async (req, res) => {
    console.log("get friends of user got hit")
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate(
            "friends", "name email image"
        )

        const acceptedFriends = user.friends;
        res.status(200).json(acceptedFriends);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// controller to post messages and store in the DB
const sendMessageToFriend = async (req, res) => {
    console.log("sendMessageToFriend cntrlr got hit")
    try {
        const { senderId, recepientId, messageType, messageText } = req.body;
        console.log("from ",senderId, "to ", recepientId)
        const newMessage = new Message({
            senderId,
            recepientId,
            messageType,
            message:messageText,
            timestamp: new Date(),
            imageUrl: messageType === "image"
        })
        await newMessage.save();
        res.status(200).json({message: "Message sent succesfully"});
    } catch (error) {
        console.log(error)
    }
}

// endpoint to get the user details for chat room header
const getChatRoomUserDetails = async(req, res)=>{
    try {
        console.log("getChatRoomUserDetails got hit")
        const {userId} = req.params;
        const receipentId = await User.findById(userId).populate("name image");
      
        const data = {
            name:receipentId.name
        }
        res.json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Internal server error"});
    }
}

// endpoint to fetch the messages between two users in the chatroom
const getMessagesOfUsers = async(req, res)=>{
    console.log("get messages of user got hit")
    try {
        const {senderId, receipentId} = req.params;
        console.log(senderId);
        console.log(receipentId)
        const messages = await Message.find({
            $or:[
                {senderId : senderId , recepientId:receipentId},
                {senderId:receipentId, recepientId:senderId}
            ]
        }).populate("senderId", "_id name");
        console.log(messages);
        res.json(messages)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal server error"})
    }
}

const userSentFriendRequests = async (req, res)=>{
    try{
        console.log("userSentFriendRequests got hit")
        const {userId} = req.params;
       const user = await User.findById(userId).populate("sentFriendRequests", "name email image").lean();
       const sentFriendRequests = user.sentFriendRequests;

       res.json(sentFriendRequests);
    }catch(error){
        console.log("Error", error);
        res.status(500).json({msg:"Internal server error"});
    }
}

const userFriends = (req, res)=>{
    try {
        console.log("userFriends got hit")
        const {userId} = req.params;
        User.findById(userId).populate("friends").then((user)=>{
            if(!user){
                return res.status(404).json({msg:"user not found"});
            }
            const friendIds = user.friends.map((friend)=>friend._id);
            res.status(200).json(friendIds)
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}
 
module.exports = { getAllUsersExceptCurrentUser, sendFriendRequest, getCurrentUserSentFriendReqs, acceptFriendRequest, getFriendsOfUser, sendMessageToFriend, getChatRoomUserDetails, getMessagesOfUsers, userSentFriendRequests, userFriends}