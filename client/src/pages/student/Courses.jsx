import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import Course from './Course.jsx';
import { useGetPublishedCoursesQuery } from '@/features/api/courseApi.js';


const Courses = () => {
    const {data,isLoading,error} = useGetPublishedCoursesQuery();
    if(error) <h1>Error Loading the courses</h1>
    return (
        <div className="bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className='mx-auto max-w-7xl p-6'>
                <h2 className='text-center text-3xl font-bold mb-10 text-gray-900 dark:text-white'>
                    Our Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))
                    ) : (
                        data?.courses && data.courses.map((course, index) => <Course key={index} course={course} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses;

const SkeletonCard = () => {
    return (
        <div className="bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
            <Skeleton className="w-full h-36" />
            <div className="px-5 py-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    );
};
