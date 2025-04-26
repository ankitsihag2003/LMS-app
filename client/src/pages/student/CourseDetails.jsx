import PurchaseCourseBtn from '@/components/ui/PurchaseCourseBtn';
import { useGetCourseDetailWithStatusQuery } from '@/features/api/purchaseApi';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const CourseDetails = () => {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const courseId = params.courseId;

    const { data, isSuccess, isLoading, isError, error,refetch } = useGetCourseDetailWithStatusQuery(courseId);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('success')) {
          refetch(); // trigger RTK Query refetch for fresh purchase status
        }
    }, [location])
    
    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Failed to load course details.</p>

    const { course, purchased } = data;

    return (
        <div className="text-gray-800 dark:text-gray-100 font-sans">
            {/* Hero / Header */}
            <div className="bg-gray-900 text-white px-6 py-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {course?.courseTitle}
                </h1>
                <p className="text-lg mb-3">{course?.courseSubtitle}</p>
                <p>
                    Created By{" "}
                    <span className="text-blue-400 underline cursor-pointer">{course?.creater?.name}</span>
                </p>
                <div className="text-sm mt-2 space-y-1">
                    <p>🕒 Last Updated {course?.createdAt?.split('T')[0]}</p>
                    <p>👨‍🎓 Students enrolled: {course?.enrolledStudents?.length}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 px-6 py-10 bg-gray-50 dark:bg-gray-800">
                {/* Left Section - Description and Course Content */}
                <div className="flex-1">
                    {/* Description */}
                    <h2 className="text-2xl font-semibold mb-3">Description</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        {course?.courseDescription}
                    </p>

                    {/* Course Content */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                        <h3 className="text-xl font-semibold mb-2">Course Content</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{course?.lectures?.length} lectures</p>
                        <ul className="space-y-2 text-gray-800 dark:text-gray-200 list-disc list-inside">
                            {course?.lectures?.map((lecture, index) => (
                                <li key={lecture._id || index}>{lecture?.lectureTitle}</li>
                            ))}
                        </ul>

                    </div>
                </div>

                {/* Right Section - Video Card */}
                <div className="w-full lg:w-1/3 bg-white dark:bg-gray-900 rounded-xl shadow p-4">
                    <div className="aspect-video mb-4">
                        <video
                            src={course?.lectures[0]?.videoUrl}
                            controls
                            className="w-full h-full object-cover rounded-md"

                        ></video>
                    </div>
                    <h4 className="text-lg font-medium mb-1">{course?.lectures[0]?.lectureTitle}</h4>
                    <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{course?.coursePrice}₹</p>
                    {purchased ? (
                        <button className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-md transition" onClick={()=>navigate(`/course-progress/${courseId}`)}>
                            Continue
                        </button>
                    ) : (
                        <PurchaseCourseBtn courseId={courseId} />
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default CourseDetails