import { User } from "../models/user.schema.js";
import bcrypt, { hash } from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";

export const register =async (req,res)=>{
    try {
        const {name , email , password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required!"
            });
        }
        const user =await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"User with this email already exist!"
            });
        }
        const hashedPassword =await bcrypt.hash(password,10);
        await User.create({
            name,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            success:true,
            message:"Account created successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Registration failed!"
        });
    }

}
export const login =async (req,res)=>{
    try {
        const {email,password} =req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required!"
            });
        }
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Email or password is incorrect!"
            });
        }
        let isPasswordMAtch =await bcrypt.compare(password , user.password);
        if(!isPasswordMAtch){
            return res.status(400).json({
                success:false,
                message:"Email or password is incorrect!"
            });
        }
        generateToken(res,user,`Welcome back ${user.name}`);
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Login failed!"
        });
    }
}
export const logout=async (_,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:"Failed to logout",
            success:false
        })
    }
}
export const getUserProfile=async (req,res)=>{
    const user_id = req.id;
    const user = await User.findById(user_id).select("-password").populate({path:"enrolled_courses"});
    if(!user){
        return res.status(404).json({
            message:"Profile not found.",
            success:false
        })
    }
    return res.status(200).json({
        success:true,
        user
    })

}
export const updateUserProfile=async (req,res)=>{
    const user_id = req.id;
    const {name} = req.body;
    const profilePhoto = req.file;
    const user = await User.findById(user_id);
    if(!user){
        return res.status(404).json({
            message:"Profile not found.",
            success:false
        })
    }
    if(user.photoUrl){
        const public_id = user.photoUrl.split("/").slice(-1)[0].split(".")[0];
        deleteMedia(public_id);
    }
    // Upload new profile photo to cloudinary
    const uploadResponse = await uploadMedia(profilePhoto.path);
    if (!uploadResponse) {
        return res.status(500).json({
            message: "Failed to upload profile photo.",
            success: false,
        });
    }
    const photoUrl = uploadResponse.secure_url;
    const updatedUser = {name,photoUrl};
    // Update user in database  
    await User.findByIdAndUpdate(user_id,updatedUser,{new:true}).select("-password");
    return res.status(200).json({
        message:"Profile updated successfully.",
        success:true,
        user:updatedUser
    })
}