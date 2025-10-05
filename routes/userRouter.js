import express from "express"
import { checkAuth, logOut, signIn, signUp } from "../controllers/authController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { updateProfile } from "../controllers/updateProfileController.js";
const userRouter = express.Router();

userRouter.post('/sign-up', signUp)
userRouter.post('/sign-in', signIn)
userRouter.put('/update-profile', isLoggedIn, updateProfile)
userRouter.get('/check', isLoggedIn, checkAuth)
userRouter.post('/logout',isLoggedIn, logOut)

export default userRouter


