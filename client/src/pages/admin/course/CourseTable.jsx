import LoadingScreen from "@/components/ui/LoadingScreen";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import React from "react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  // Sample data for courses
  const navigate = useNavigate()
  const {data,isLoading,error} = useGetCreatorCourseQuery();
  if(isLoading) {
    return <LoadingScreen/>
  }

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
      {/* Top Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Your Courses
        </h1>
        <button onClick={()=>navigate("create")} className="bg-black text-white px-4 py-2 rounded hover:opacity-90 dark:bg-white dark:text-black font-medium transition text-sm sm:text-base hover:bg-gray-900 hover:cursor-pointer">
          Create New Course
        </button>
      </div>

      {/* Responsive Table */}
      <div className="w-full overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Price
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.courses.map((course) => (
              <tr
                key={course._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 sm:px-6 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                  {course?.courseTitle}
                </td>
                <td className="px-4 sm:px-6 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {course?.coursePrice ? course?.coursePrice : "NA"}
                </td>
                <td className="px-4 sm:px-6 py-3 text-sm whitespace-nowrap">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold dark:bg-green-200 dark:text-green-800">
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3 text-sm whitespace-nowrap">
                  <button className="border px-3 py-1 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition" onClick={()=>navigate(course._id)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;