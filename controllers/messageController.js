import messageModel from "../models/messageModel.js"
import userModel from "../models/userModel.js"

//get all users expect the sender for sidebar
export const getAllUsersExceptSelf = async (req, res)=>{
    try {
        const userId = req.user._id
        const filteredUser = userModel.find({_id: {$ne:userId}}).select("-password").populate('messages') // _id: {$ne:userId} is for filter
        res.json({success:true, message:"All contacts with their messages retrieved succesfully", data: filteredUser})
    } catch (error) {
        console.log(error.message)
        return res.json({success: false, message: error.message})
    }
}

export const getAllMessagesForChatSection = async (req, res)=>{
    try {
        const { personId } = req.params
    const person = userModel.findOne({_id: personId}).populate('messages')
    if (!person) {
        throw new Error("User not found");
      }
  
      await messageModel.updateMany(
        { _id: { $in: person.messages.map(m => m._id) } },
        { $set: { seen: true } }
      );
    return res.json({success: true, message:"user and person data retireved successfully" ,data:{
        personData: person,
        myData: req.user
    }})
    } catch (error) {
        console.log(error.message)
        return res.json({success: false, message: error.message})
    }
    
}
