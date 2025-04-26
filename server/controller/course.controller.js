import { Course } from '../models/course.schema.js';
import { Lecture } from '../models/lecture.schema.js';
import { deleteMedia, deleteVideo, uploadMedia } from '../utils/cloudinary.js';

export const createCourse = async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }
        const course = await Course.create({
            courseTitle: title,
            courseCategory: category,
            creater: req.id,
        });
        return res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create course',
        });
    }
}
export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creater: userId });
        if (!courses) {
            return res.status(404).json({
                courses: [],
                message: 'No courses found',
            });
        }
        return res.status(200).json({
            courses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get courses',
        });
    }
}
export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { courseTitle, courseSubtitle, courseDescription, courseCategory, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }
        let courseThumbnail = course.courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split('/').pop().split('.')[0];
                await deleteMedia(publicId);
            }
            courseThumbnail = await uploadMedia(thumbnail.path);
        }
        const updated_course = await Course.findByIdAndUpdate(courseId, {
            courseTitle,
            courseSubtitle,
            courseDescription,
            courseCategory,
            courseLevel,
            coursePrice,
            courseThumbnail: courseThumbnail.secure_url,
        }, { new: true });
        return res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course: updated_course,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update course',
        });
    }
}
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }
        return res.status(200).json({
            success: true,
            course,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get course',
        });
    }
}
export const createCourseLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course id is required!"
            });
        }
        if (!lectureTitle) {
            return res.status(400).json({
                success: false,
                message: "Lecture title is required!"
            });
        }
        const lecture = await Lecture.create({ lectureTitle });
        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(201).json({
            success: true,
            message: 'Lecture created successfully',
            lecture,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create lecture',
        });
    }
}
export const getCourseLectures = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('lectures');
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }
        return res.status(200).json({
            success: true,
            lectures: course.lectures
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create lecture',
        });
    }
}
export const editLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { lectureTitle, videoInfo, IsFree } = req.body;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found!"
            })
        }
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = IsFree;
        await lecture.save();

        //update the lecture in the course
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(200).json({
            message: "Lecture updated successfully",
            lecture
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update lecture',
        });
    }

}
export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        //remove video from cloudinary
        if (lecture?.publicId) {
            await deleteVideo(lecture.publicId);
        }
        //removing the lecture ref
        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        )
        return res.status(200).json({
            message: "Lecture removed successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to remove lecture',
        });
    }
}
export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                success:false,
                message:"Lecture not found!"
            })
        }
        return res.status(200).json({
            success:true,
            lecture
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get lecture by id',
        });
    }
}
export const toggleCoursePublish = async (req,res)=>{
    try {
        const {courseId} = req.params;
        const {publish} = req.query;
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success:false,
                message:"Course not found!"
            })
        }
        course.isPublished = publish === 'true';
        await course.save();
        return res.status(200).json({
            success:true,
            message:`Course is ${course.isPublished  ? 'published' : 'unpublished'}!`
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to change status',
        });
    }
}
export const getPublishedCourses = async (_,res)=>{
    try {
        const courses = await Course.find({isPublished:true}).populate('creater','name photoUrl');
        if(!courses){
            return res.status(404).json({
                success:false,
                message:"No courses found!"
            })
        }
        return res.status(200).json({
            success:true,
            courses
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get published courses',
        });
        
    }
}
export const searchCourses = async (req,res)=>{
    try {
       const {query="",categories=[],sortPrice=""} = req.query;
       const searchQuery = {
        isPublished: true,
        $or:[
            {courseTitle:{$regex:query, $options:'i'}},
            {courseSubtitle:{$regex:query, $options:'i'}},
            {courseCategory:{$regex:query, $options:'i'}},
        ]
       }

       // if category filter is provided
       if(categories.length>0){
           searchQuery.courseCategory = {$in:categories}
       }
       // if sort price is provided
       const sortOptions = {};
       if(sortPrice === 'Low to High'){
           sortOptions.coursePrice = 1;
       }else if(sortPrice === 'High to Low'){
           sortOptions.coursePrice = -1;
       }
       const courses = await Course.find(searchQuery).sort(sortOptions).populate('creater','name photoUrl');
       return res.status(200).json({
        success:true,
        courses: courses || []
       })
    } catch (error) {
        console.log(error);
    }
}