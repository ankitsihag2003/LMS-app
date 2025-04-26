import { Course } from "../models/course.schema.js";
import { CourseProgress } from "../models/courseProgress.schema.js";


export const getCourseProgress = async(req,res)=>{
    try {
        const courseId = req.params.courseId;
        const userId = req.id;
        
        //fetch the user course progress
        const courseProgress = await CourseProgress.findOne({userId, courseId}).populate("courseId");
        const courseDetails = await Course.findById(courseId).populate("lectures");

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }
        
        // if no progress found, then return course details with empty progress
        if(!courseProgress){
            return res.status(200).json({
                courseDetails,
                progress:[],
                completed: false
            });
        }
        // return course progress of the user with the course details
        return res.status(200).json({
            courseDetails,
            progress: courseProgress.lectureProgress,
            completed: courseProgress.completed
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateLectureProgress = async(req,res)=>{
    try {
        const {courseId,lectureId} = req.params;
        const userId = req.id;
        //fetch course progress
        let courseProgress = await CourseProgress.findOne({userId, courseId});

        //if course progress not found, then create a new one
        if(!courseProgress){
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress:[]
            });
        }
        // find the current lecture progress
        const lectureIndex = courseProgress.lectureProgress.findIndex((lp)=>lp.lectureId === lectureId);
        if(lectureIndex !== -1){
            //update the status
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }else{
            //add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed: true
            });
        }
        // if all lectures are viewed, then mark the course as completed
        const lecturesViewedLength = courseProgress.lectureProgress.filter((lp)=>lp.viewed).length;
        const course = await Course.findById(courseId);

        if(lecturesViewedLength === course.lectures.length){
            courseProgress.completed = true;
        }
        await courseProgress.save();

        return res.status(200).json({
            message:"Lecture progress updated successfully!",
        });
    } catch (error) {
        console.log(error);
    }
}
export const markCourseAsCompleted = async(req,res)=>{
    try {
        const courseId = req.params.courseId;   
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({userId,courseId});
        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message:"Course progress not found!"
            });
        }
        courseProgress.lectureProgress.map((lp)=>lp.viewed = true);
        courseProgress.completed = true;
        await courseProgress.save();
        return res.status(200).json({
            message:"Course marked as completed successfully!"
        });
    } catch (error) {
        console.log(error);
    }
}
export const markCourseAsIncompleted = async(req,res)=>{
    try {
        const courseId = req.params.courseId;   
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({userId,courseId});
        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message:"Course progress not found!"
            });
        }
        courseProgress.lectureProgress.map((lp)=>lp.viewed = false);
        courseProgress.completed = false;
        await courseProgress.save();
        return res.status(200).json({
            message:"Course marked as inCompleted!"
        });
    } catch (error) {
        console.log(error);
    }
}