import mongoose from "mongoose";
import config from "./config.js";

async function connectDB(){
    try{
        if(mongoose.connect(config.MONGO_URI)){
            console.log("Connected to DB successfully");
        }
        else{
            console.log("Didnt connected to DB");
        }    
    }
    catch(error){
        console.log("Error: "+ error);
    }
}

export default connectDB;