import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
        unique: true
    },
    fullName: {
        type:String,
        required: true,
    },
    password: {
        type:String,
        required: true,
        minlength: 8,
    },
    profilePic: {
        type:String,
        default: ""
    },
    bio: {
        type:String,
    },
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "message"
    }]
},{timestamps:true})

const user =  mongoose.model('user', userSchema)
export default user