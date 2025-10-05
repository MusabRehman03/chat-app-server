import userModel from "../models/userModel.js"
import {generateToken} from "../lib/utils.js"
import bcrypt from "bcrypt"

// user register controller
// export const signUp = async (req, res)=>{
//     const { fullName, email, password, bio } = req.body;
//     try {
//         if(!fullName || !email || !password || !bio){
//             return res.json({success: false, message: "Missing details"})
//         }
//         const user = await userModel.findOne({email})
//         if(user){
//             return res.json({success: false, message: "Account already exist"})
//         }

//         bcrypt.genSalt(10, function(err, salt) {
//             bcrypt.hash(password, salt, async function(err, hash) {
//                 user = await userModel.create({fullName, email, password: hash, bio})
//             });
//         });
//         const token = generateToken(user._id)
//         res.cookie("token", token)
//         res.json({success: true, message: "Account created successfully", user: user})
//     } catch (error) {
//         console.log(error.message)
//         res.json({success: false, message: error.message})
//     }
// }
export const signUp = async (req, res) => {
    try {
      const { fullName, email, password, bio } = req.body;
  
      if (!fullName || !email || !password || !bio) {
        return res.json({ success: false, message: "Missing details" });
      }
  
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.json({ success: false, message: "Account already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      const user = await userModel.create({ fullName, email, password: hash, bio });
      const token = generateToken(user._id);
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // must be false for localhost
        sameSite: "Lax", // or "None" if needed
      });
  
      res.json({ success: true, message: "Account created successfully", user });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };


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
        bcrypt.compare(password, user.password, function(err, result) {
            if(result){
                const token = generateToken(user._id)
                // res.cookie("token", token)
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false, // must be false for localhost
                    sameSite: "Lax", // or "None" if needed
                  });
                res.json({success: true, message: "User authenticated", user: user, token:token})
            }else{
                return res.json({success: false, message: "Invalid credentials"})
            }
        });
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const checkAuth = (req, res)=>{
    try{
        res.json({success: true, user: req.user})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const logOut = function (req, res) {
    try{
        res.cookie("token", "");
        res.json({success: true, message:"User logged out successfully"})
    }catch(error){
        res.json({success: false, message:error.message})
    }

  }