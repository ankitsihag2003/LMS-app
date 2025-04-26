import React from 'react'
import Course from './Course.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { useGetUserQuery } from '@/features/api/authApi.js';

const MyLearning = () => {
    const {data,isLoading}=useGetUserQuery();
    const enrolled_courses = data?.user?.enrolled_courses;
    return (
        <div className='my-8'>
            <div className="flex flex-col px-4 sm:px-6 md:px-12 lg:px-20">
                <div className='mb-5'>
                    <h1 className='font-bold text-lg'>MY LEARNING</h1>
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ?
                        <SkeletonCard /> :
                        enrolled_courses.length == 0 ?
                            <p className='font-semibold'>You haven't enrolled yet.</p> :
                            enrolled_courses.map((course) => <Course key={course._id} course = {course} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default MyLearning

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