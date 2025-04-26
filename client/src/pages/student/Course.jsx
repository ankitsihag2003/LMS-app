import { Card } from '@/components/ui/card'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom';


const Course = ({ course }) => {
    return (
        <Link to={`/course-detail/${course._id}`}>
            <Card className='dark:bg-gray-800 pt-0 overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 bg-white transition-all duration-300 cursor-pointer'>
                <div className="relative" key={course._id}>
                    <img
                        src={course?.courseThumbnail || "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"}
                        alt="course"
                        className='rounded-t-lg object-cover h-36 w-full mb-2'
                    />
                    <div className="flex flex-col px-3">
                        <h1 className='truncate font-bold text-lg hover:underline mb-3 dark:text-white'>{course.courseTitle}</h1>
                        <div className="flex justify-between mb-3">
                            <div className="flex justify-between items-center gap-3">
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={course.creater.photoUrl || "/default-avatar.png"} />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <h1 className='font-medium text-sm dark:text-white'>{course.creater.name}</h1>
                            </div>
                            <Badge className="bg-indigo-500 text-white rounded-full px-2 py-1 text-xs">{course.courseLevel}</Badge>
                        </div>
                        <div className="font-bold text-lg">
                            <span>₹{course.coursePrice}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default Course