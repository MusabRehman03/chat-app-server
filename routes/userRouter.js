import express from "express"
import { signIn, signUp } from "../controllers/authController";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { updateProfile } from "../controllers/updateProfileController.";
const userRouter = express.Router();

userRouter.post('/sign-up', signUp)
userRouter.post('/sign-in', signIn)
userRouter.post('/update-profile', isLoggedIn, updateProfile)

export default userRouter


