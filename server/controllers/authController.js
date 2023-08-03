const mongoose = require('mongoose');
const User = require("../models/userModel");
const jwt = require('jsonwebtoken')

const createToken = (userId)=>{
    const payload = {
        userId: userId
    }
    const token = jwt.sign(payload, process.env.SECRET)
    return token;
}

const login = (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(404).json({message:"Email and the password are required"})
    }

    User.findOne({email}).then((user)=>{
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        if(user.password !== password){
            return res.status(404).json({message:"Invalid password"})
        }
        const token = createToken(user._id);
        res.status(200).json({token})
    })
}

const register = (req,res)=>{
    const {name,email,password,image} = req.body;
    console.log("\n\t Register got hit")

    const newUser = new User({name,email,password,image})
    newUser.save().then(()=>{
        res.status(200).json({message:"User registered Sucessfull"})
    }).catch((err)=>{
        console.log("Error registering user",err);
        res.status(500).json({message: "Error registering the user!"});
    })
}

module.exports = {
    login :login,
    register :register

}