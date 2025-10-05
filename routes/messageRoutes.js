import express from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
import {  getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js"
const messageRouter = express.Router()

messageRouter.get('/users', isLoggedIn, getUsersForSidebar)
messageRouter.get('/:id', isLoggedIn, getMessages)
messageRouter.put('/mark/:id', isLoggedIn, markMessageAsSeen)
messageRouter.post("/send/:id", isLoggedIn, sendMessage)

export default messageRouter