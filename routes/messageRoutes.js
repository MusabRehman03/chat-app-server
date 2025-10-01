import express from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn"
import { getAllMessagesForChatSection, getAllUsersExceptSelf, sendMessage } from "../controllers/messageController"
const messageRouter = express.Router()

messageRouter.get('/users', isLoggedIn, getAllUsersExceptSelf)
messageRouter.get('/:id', isLoggedIn, getAllMessagesForChatSection)
messageRouter.post("/send/:id", isLoggedIn, sendMessage)

export default messageRouter