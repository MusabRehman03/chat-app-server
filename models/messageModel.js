import mongoose from "mongoose"

const messageModel = new mongoose.Schema({
    senderId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        
    },
    recieverId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    text: {
        type:String,
    },
    image: {
        type:String,
    },
    seen: {
        type:Boolean,
        default: false
    }
},{timestamps:true})

const message =  mongoose.model('message', messageModel)
export default message;