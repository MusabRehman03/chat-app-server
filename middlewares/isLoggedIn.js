import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

export const isLoggedIn = async (req, res, next)=>{
    try {
        //const token = req.headers.token   this could be like this as well if we dont use cookies
        const token = req.cookies.token
        if(!token|| token==""){
            return res.json({success: false, message: "User is not authenticated"})
        }else{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.userId).select("-password").populate('messages')
            if(!user) return res.json({success: false, message: "User not found"})
            req.user = user
            next()
        }
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
    
}