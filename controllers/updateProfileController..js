import cloudinary from "../lib/cloudinary"
import userModel from "../models/userModel.js"

export const updateProfile = async (req, res)=>{
    try {
        const {profilePic, bio, fullName} = req.body
        const userId = req.user._id
        
        if(!profilePic){
            const updatedUser = await userModel.findOneAndUpdate({_id: userId}, {bio, fullName}, {new:true})
            return res.json({success: true, message:"User details updated successfully", data: {user: updatedUser}})
        }else{
            const uploaded = await cloudinary.uploader.upload(profilePic)
            const updatedUser = await userModel.findOneAndUpdate({_id: userId}, {bio, fullName, profilePic: uploaded.secure_url}, {new:true})
            return res.json({success: true, message:"User details updated successfully", data: {user: updatedUser}})
        }
    } catch (error) {
        return res.json({success: false, message: error.message})
    }


}