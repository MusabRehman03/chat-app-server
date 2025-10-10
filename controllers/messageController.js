import cloudinary from "../lib/cloudinary.js"
import messageModel from "../models/messageModel.js"
import userModel from "../models/userModel.js"
import {io, userSocketMap} from "../server.js"

//get all users expect the sender for sidebar
// export const getAllUsersExceptSelf = async (req, res)=>{
//     try {
//         const userId = req.user._id
//         const filteredUser = userModel.find({_id: {$ne:userId}}).select("-password").populate('messages') // _id: {$ne:userId} is for filter
//         res.json({success:true, message:"All contacts with their messages retrieved succesfully", data: filteredUser})
//     } catch (error) {
//         console.log(error.message)
//         return res.json({success: false, message: error.message})
//     }
// }
// export const getUsersForSidebar = async (req, res)=>{
//     try {
//         const userId = req.user._id
//         const filteredUsers = await userModel.find({_id: {$ne: userId}}).select('-password')
//         //count of unseen messages for each user
//         const unseenMessages = {}
//         const promises  = filteredUsers.map(async (user)=>{
//             const messages = await messageModel.find({senderId: user._id, recieverId: userId, seen:false})
//             if(messages.length>0){
//                 unseenMessages[user._id]= messages.length
//             }
//             await Promise.all(promises)
//             res.json({success: true, users: filteredUsers, unseenMessages})
//         })
//     } catch (error) { 
//         console.log(error.message)
//         res.json({success: false, message: "hello there"})
//     }
// }
export const getUsersForSidebar = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Get all users except the logged-in one
      const filteredUsers = await userModel
        .find({ _id: { $ne: userId } })
        .select('-password');
  
      // For unseen message counts
      const unseenMessages = {};
  
      // Create an array of promises (one per user)
      const promises = filteredUsers.map(async (user) => {
        const count = await messageModel.countDocuments({
          senderId: user._id,
          recieverId: userId,
          seen: false,
        });
        if (count > 0) unseenMessages[user._id] = count;
      });
  
      // Wait for all message counts to finish
      await Promise.all(promises);
  
      // Send final response once
      res.json({
        success: true,
        users: filteredUsers,
        unseenMessages,
        message: "Users fetched successfully",
      });
  
    } catch (error) {
      console.error(error.message);
      res.json({ success: false, message: "Something went wrong" });
    }
  };
  
// export const getAllMessagesForChatSection = async (req, res)=>{
//     try {
//         const { personId } = req.params
//     const person = userModel.findOne({_id: personId}).populate('messages')
//     if (!person) {
//         throw new Error("User not found");
//       }
  
//       await messageModel.updateMany(
//         { _id: { $in: person.messages.map(m => m._id) } },
//         { $set: { seen: true } }
//       );
//     return res.json({success: true, message:"user and person data retireved successfully", authUser: req.user, otherUser: person})
//     } catch (error) {
//         console.log(error.message)
//         return res.json({success: false, message: error.message})
//     }
    
// }

// get all messages for selcted user
export const getMessages= async(req, res)=>{
    try {
        const {id: selectedUserId} = req.params
        const myId = req.user._id

        const messages = await messageModel.find({
            $or:[
                {senderId: myId, recieverId: selectedUserId},
                {senderId: selectedUserId, recieverId: myId}
            ]

        })
        await messageModel.updateMany({senderId: selectedUserId, recieverId: myId}, {seen:true})

        res.json({success: true, messages})
    } catch (error) {
        console.log(error.message)
        return res.json({success: false, message: error.message})
    }
}

// mark message as seen for individul message with id

export const markMessageAsSeen = async (req, res) =>{
    try {
        const {id} = req.params
        await messageModel.findByIdAndUpdate(id,{seen: true })
        res.json({success: true})
        
    } catch (error) {
        console.log(error.message)
        return res.json({success: false, message: error.message})
    }
}

export const sendMessage = async (req, res)=>{
    try {
        const { id: recieverId } = req.params;
        const senderId = req.user._id
        const { text, image } = req.body
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = await messageModel.create({
            recieverId,
            senderId,
            text,
            image: imageUrl
        })

        const recieverSocketId = userSocketMap[recieverId]
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }
        return res.json({success: true, message: newMessage})
    } catch (error) {
        console.log(error.message)
        return res.json({success: false, message: error.message})
    }
}