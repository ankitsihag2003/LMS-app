import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from "lucide-react";
import CourseTab from './CourseTab';

const CourseEdit = () => {
    return (
        <div className='p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen w-full'>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center p-3 dark:text-white">
                <h1 className='text-2xl font-bold'>Enter the details of your course</h1>
                <Link to="lecture" className='hover:underline text-sm flex items-center text-blue-600 dark:text-blue-400'>Go to lecture page<ArrowRight className='ml-1 w-4 h-4'/></Link>
            </div>
            <CourseTab/>
        </div>
    )
}

export default CourseEdit