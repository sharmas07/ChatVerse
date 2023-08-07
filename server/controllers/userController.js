const User = require('../models/userModel')

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

// controller to show all the friendRequests sent by current userid
const getCurrentUserSentFriendReqs = async (req, res) => {
    try {
        const {userId} = req.params

        // fetch the user document based on the user id
        const user = await User.findById(userId).populate("friendRequests", "name email image").lean();
        const friendRequests = user.friendRequests;
        res.json(friendRequests);
    } catch (error) {
        res.sendStatus(500);
    }
}

module.exports = { getAllUsersExceptCurrentUser, sendFriendRequest, getCurrentUserSentFriendReqs }