import express from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn"
import { getAllUsersExceptSelf } from "../controllers/messageController"
const messageRouter = express.Router()

messageRouter.get('/users', isLoggedIn, getAllUsersExceptSelf)