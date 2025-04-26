import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router  = express.Router();

router.route("/video-upload").post(upload.single("file"), async (req,res)=>{
    try {
        const file = req.file.path;
        const result = await uploadMedia(file);
        if(result){
            return res.status(200).json({
                success:true,
                message:"uploaded successfully",
                data:result
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"upload failed"})
    }
});

export default router;

