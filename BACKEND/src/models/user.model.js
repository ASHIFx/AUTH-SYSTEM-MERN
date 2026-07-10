import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"username require"],
        unique:[true,"username already taken"]
    },
    email:{
        type:String,
        required:[true,"email require"],
        unique:[true,"email already taken"]
    },
    password:{
        type:String,
        required:[true,"password require"]
    },
    verified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const userModel = mongoose.model("user",userSchema);

export default userModel;