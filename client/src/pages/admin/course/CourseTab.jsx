import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import LoadingScreen from '@/components/ui/LoadingScreen';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCourseByIdQuery, useToggleCoursePublishMutation, useUpdateCreatorCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseTab = () => {
    const isPublish = false;
    const params = useParams();
    const navigate = useNavigate();
    const[updateCreatorCourse,{data,isLoading, isError, error, isSuccess}]=useUpdateCreatorCourseMutation();
    const {data:CourseData,isLoading:getCourseLoading,refetch}=useGetCourseByIdQuery(params.courseId,{refetchOnMountOrArgChange:true});
    const [toggleCoursePublish,{data:publishData,error:publishError}] = useToggleCoursePublishMutation();

    const [input, setinput] = useState({courseTitle: "", courseSubtitle: "", courseDescription: "",courseCategory:"",courseLevel:"",coursePrice:"", courseThumbnail: ""});
    const [previewThumbnail, setPreviewThumbnail] = useState("");

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message||"Course updated successfully");
            navigate("/admin/Courses");
        }
        if (isError) {
            toast.error(error.data.message || "Something went wrong");
        }
    }, [isSuccess,error]);
    useEffect(() => {
        if(CourseData?.course){
            const course = CourseData.course;
            setinput({
                courseTitle: course.courseTitle,
                courseSubtitle: course.courseSubtitle,
                courseDescription: course.courseDescription,
                courseCategory: course.courseCategory,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: ""
            })
        }
    }, [CourseData])
    
    const CourseStatusHandler = async (isPublish) => {
        try {
            const response = await toggleCoursePublish({courseId:params.courseId,query:isPublish});
            refetch();
            toast.success(response.data.message);
        } catch (error) {
            toast.error(publishError.data.message);
        }
    }
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("courseSubtitle", input.courseSubtitle);
        formData.append("courseDescription", input.courseDescription);
        formData.append("courseCategory", input.courseCategory);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseThumbnail", input.courseThumbnail);
        await updateCreatorCourse({formData,courseId:params.courseId});
    }

    const setCategory = (value) => {
        setinput({...input, courseCategory: value});
    } 
    const setCourseLevel = (value) => {
        setinput({...input, courseLevel: value});   
    }       
    const setCourseThumbnail = (e) => {
        const file = e.target.files[0];
        if(file){
            setinput({...input, courseThumbnail: file});
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        }
    } 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setinput({ ...input, [name]: value });
    }  
    return (
        <Card className="max-w-6xl mx-auto mt-6 shadow-xl rounded-2xl">
            {getCourseLoading && (
                <LoadingScreen/>
            )}
            <CardHeader className="flex flex-col items-start justify-between px-4 sm:px-8 sm:py-1 rounded-t-2xl">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Course Details</h2>
                <div className="flex flex-col space-y-3 sm:flex-row w-full sm:justify-between">
                    <div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Make changes to your course here. Click save when you are done.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button disabled={CourseData?.course.lectures.length === 0} variant="outline" onClick={()=>CourseStatusHandler(CourseData?.course.isPublished == true ? false : true)}>
                            {CourseData?.course.isPublished ? (
                                <span>UnPublish</span>
                            ) : (
                                <span>Publish</span>
                            )}
                        </Button>
                        <Button>Remove Course</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-4 px-4 sm:px-8 py-6 -mb-4">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-200 font-bold">Course Title</label>
                        <input type="text" name='courseTitle' value={input.courseTitle} onChange={(e)=>handleChange(e)} className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="Enter course title" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-200 font-bold">Course Sub-Title</label>
                        <input type="text" name='courseSubtitle' value={input.courseSubtitle} onChange={(e)=>handleChange(e)} className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="Enter course sub-title" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-200 font-bold">Course Description</label>
                        <textarea name='courseDescription' value={input.courseDescription} onChange={(e)=>handleChange(e)} rows="4" className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="Enter course description"></textarea>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                        <div className="flex flex-col">
                            <label className='font-bold mb-1 text-sm'>Category</label>
                            <Select onValueChange={(value)=>setCategory(value)} className="flex flex-col">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full Stack Development">Full Stack Development</SelectItem>
                                    <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                    <SelectItem value="Backend Development">Backend Development</SelectItem>
                                    <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                                    <SelectItem value="Game Development">Game Development</SelectItem>
                                    <SelectItem value="Data Science">Data Science</SelectItem>
                                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                                    <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                                    <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                                    <SelectItem value="Natural Language Processing">Natural Language Processing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col">
                            <label className='font-bold mb-1 text-sm'>Course Level</label>
                            <Select onValueChange={(value)=>setCourseLevel(value)} className="flex flex-col">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col">
                            <label className='font-bold mb-1 text-sm'>Price</label>
                            <input type="number" name='coursePrice' value={input.coursePrice} onChange={(e)=>handleChange(e)} className="border border-gray-300 rounded-md py-[7px] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm" placeholder="Enter course price" />
                        </div>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <label className='font-bold mb-1 text-sm'>Course Thumbnail</label>
                        
                        <input type="file" accept='image/*' onChange={(e)=>setCourseThumbnail(e)}  className="border border-gray-300 rounded-md py-[7px] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm max-w-2xs" placeholder="Upload course thumbnail" />
                        {previewThumbnail && (
                            <div className="mt-2">
                                <img src={previewThumbnail} alt="Preview" className="w-90 h-50 object-cover rounded-md" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-3 px-4 sm:px-8 py-6">
                    <Button variant="outline" onClick={()=>navigate("/admin/Courses")}>Cancel</Button>
                    <Button disabled={isLoading} onClick={handleSubmit}>
                        {isLoading ? (
                            <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Please wait
                            </>
                        ) : (
                            <span>Save</span>
                        )}
                    </Button>
                </div>
            </CardContent>

        </Card>
    )
}

export default CourseTab