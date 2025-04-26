import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY,
})

const uploadMedia = async(file)=>{
    try {
        const uploadPromise = await cloudinary.uploader.upload(file, {
            resource_type: "auto"
        });
        return uploadPromise;
    } catch (error) {
        console.log(error);
    }
}
const deleteMedia = async(public_id)=>{
    try {
        await cloudinary.uploader.destroy(public_id, {
            resource_type: "image"
        });
    } catch (error) {
        console.log(error);
    }
}
const deleteVideo = async(public_id)=>{
    try {
        await cloudinary.uploader.destroy(public_id, {
            resource_type: "video"
        });
    } catch (error) {
        console.log(error);
        
    }
}

export {uploadMedia,deleteMedia,deleteVideo};


