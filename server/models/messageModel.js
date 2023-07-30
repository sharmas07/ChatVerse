const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receipentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    messageType:{
        type:String,
        enum:['text', 'image']
    },
    message:String,
    imageUrl: String,
    timeStamp:{
        type:Date,
        default:Date.now
    }
})

const messageModel = mongoose.model('messageModel', messageSchema)
module.export = messageModel