import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CirclePlay } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from "@/features/api/courseProgressApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const lectures = [
  "Introduction to Docker and Containerization",
  "Setting Up Your Docker Environment",
  "Understanding Docker Images and Containers",
  "Building Custom Docker Images with Dockerfile",
  "Managing Multi-Container Applications with Docker Compose",
];

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;

  const [CurrLecture, setCurrLecture] = useState(null);
  

  const {data,isLoading,error,refetch}=useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse,{data:markCompleteData , isSuccess:markCompleteSuccess}] = useCompleteCourseMutation();
  const [inCompleteCourse,{data:markInCompleteData , isSuccess:markInCompleteSuccess}] = useInCompleteCourseMutation();

  useEffect(() => {
    if(markCompleteSuccess){
      refetch();
      toast.success(markCompleteData.message)
    }
    if(markInCompleteSuccess){
      refetch();
      toast.success(markInCompleteData.message)
    }
  }, [markCompleteSuccess, markInCompleteSuccess])

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load course progress.</p>;
  const {courseDetails, progress, completed} = data;


  const initialLecture = CurrLecture || courseDetails.lectures && courseDetails.lectures[0];


  const isLectureCompleted = (lectureId)=>{
      return progress.some((prog)=>prog.lectureId===lectureId && prog.viewed);
  }
  const handleUpdateLectureProgress = async (lectureId) => {
    await updateLectureProgress({courseId , lectureId});
    refetch();
  }

  const handleSelectLecture = (lecture) => {
      setCurrLecture(lecture);
      handleUpdateLectureProgress(lecture._id);
  }
  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  }
  const handleIncompleteCourse = async () => {
    await inCompleteCourse(courseId);
  }

  return (
    <div className="min-h-screen p-4 sm:px-15 sm:py-5 bg-white text-gray-900 dark:bg-background dark:text-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-center text-xl font-bold mb-4">{courseDetails.courseTitle}</h2>
        <Button className="mb-4" onClick={completed ? handleIncompleteCourse : handleCompleteCourse}>
          {completed? <div className="flex items-center"><CheckCircle2 className="w-7 h-7 mr-2" />Completed</div>  : "Mark as complete"}
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
          </CardHeader>
          <CardContent className="p-4">
            <video className="w-full rounded" controls onPlay={()=>handleUpdateLectureProgress(CurrLecture?._id || initialLecture._id)}>
              <source src={CurrLecture?.videoUrl || initialLecture.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="p-0 mt-3">
              <p className="font-medium cursor-pointer">
                {`Lecture ${courseDetails.lectures.findIndex(lec => lec._id=== (CurrLecture?._id || initialLecture._id)) + 1}: ${CurrLecture?.lectureTitle || initialLecture.lectureTitle} `}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Lectures</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {courseDetails?.lectures.map((lecture) => (
                <li
                  key={lecture._id}
                  className={`border border-border rounded-lg p-3 hover:bg-muted dark:hover:bg-muted/70 cursor-pointer transition-colors flex justify-between ${(CurrLecture?._id === lecture._id)? "bg-muted dark:bg-muted/70" : ""}`}
                  onClick={() => handleSelectLecture(lecture)}
                >
                  <div className="flex gap-2">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500" />
                    ) :
                      (
                        <CirclePlay size={24} className="text-green-500" />
                      )}
                    {lecture.lectureTitle}
                  </div>
                  {isLectureCompleted(lecture._id) && <Badge variant={"outline"} className="text-green-600 bg-green-200">Completed</Badge>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseProgress;