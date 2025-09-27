import userModel from "../models/userModel.js"
import {generateToken} from "../lib/utils.js"
import bcrypt from "bcrypt"

// user register controller
export const signUp = async (req, res)=>{
    const { fullName, email, password, bio } = req.body;
    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing details"})
        }
        const user = await userModel.findOne({email})
        if(user){
            return res.json({success: false, message: "Account already exist"})
        }

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                user = await userModel.create({fullName, email, password: hash, bio})
            });
        });
        const token = generateToken(user._id)
        res.cookie("token", token)
        res.json({success: true, message: "Account created successfully", data: user})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}


// user login controller
export const signIn = async (req, res)=>{
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.json({success: false, message: "Missing details"})
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success: false, message: "Invalid credentials"})
        }
        bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
            if(result){
                const token = generateToken(user._id)
                res.cookie("token", token)
                res.json({success: true, message: "User authenticated", data: user})
            }else{
                return res.json({success: false, message: "Invalid credentials"})
            }
        });
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}