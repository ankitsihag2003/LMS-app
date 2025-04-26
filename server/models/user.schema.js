import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type:"String",
        required:true
    },
    email:{
        type:"String",
        required:true
    },
    password:{
        type:"String",
        required:true
    },
    roles:{
        type:"String",
        enum:["student","instructor"],
        default:"student"
    },
    enrolled_courses:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course'
    }],
    photoUrl:{
        type:"String",
        default:""
    }
},{timestamps:true});

export const User = mongoose.model("User",userSchema);