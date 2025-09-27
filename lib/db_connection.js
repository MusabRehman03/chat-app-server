// this can also be done in config folder
import mongoose from "mongoose"

export const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=>{
            console.log("DB connected succesfully")
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/chatApp`)

    } catch (error) {
        console.log(error.message)
    }
}