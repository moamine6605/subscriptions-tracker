import mongoose from "mongoose";
import 'dotenv/config.js'


if(!process.env.DB_URI) {
    throw new Error('please define the DB_URI variable')
}


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_URI)
    } catch(err) {
        console.error(err)
    }
}

export default connectDB;