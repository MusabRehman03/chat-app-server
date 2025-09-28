//to use import statement in project, we need to specify th etype property in package.json to "module"
import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db_connection.js"
import userRouter from "./routes/userRouter.js"

//create express app and http server
const app = express()
const server = http.createServer(app)

//middleware setup
app.use(express.json({limit:"4mb"}))
app.use(cors())
app.use("/api/auth/", userRouter)

app.get("/api/status", (req, res)=>{ // can be app.use as well
    res.send("server is running")
})

//connnect to mongodb
await connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log("server is running on PORT: "+ PORT)
})