
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateCourseLectureMutation, useGetCourseLecturesQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [createCourseLecture, { data, isSuccess, isLoading, error }] = useCreateCourseLectureMutation()
  const { data: lectureData, isLoading: lectureLoading, error: lectureError ,refetch} = useGetCourseLecturesQuery(courseId);

  const [input, setinput] = useState("")

  const handleSubmit = async () => {
    await createCourseLecture({ courseId, lectureTitle: input });
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Lecture created successfully!")
      refetch()
    }
    if (error) {
      toast.error(error.data.message || "Something went wrong!")
    }

  }, [isSuccess, error])


  return (
    <div className="p-4 sm:p-6 md:p-10 w-full min-h-[calc(100vh-4rem)] dark:bg-gray-900 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold tracking-tight mb-2 dark:text-white">
          Let's add lectures, add some basic details for your new lecture
        </h2>
        <p className="text-muted-foreground mb-6 dark:text-gray-400">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>

        <div className="grid gap-6">
          <div>
            <Label htmlFor="title" className="dark:text-gray-200">Title</Label>
            <Input
              name="lectureTitle"
              placeholder="Your Lecture Title Name"
              className="mt-1"
              value={input}
              onChange={(e) => setinput(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(`/admin/Courses/${courseId}`)}>Back to course</Button>
            <Button disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin">Creating...</Loader2> : "Create Lecture"}
            </Button>
          </div>
        </div>
        <div className='mt-10'>
          <h2 className="text-2xl font-semibold tracking-tight mb-3 dark:text-white">Your Lectures</h2>
          <div className='flex flex-col gap-4'>
            {
              lectureLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin">Loading...</Loader2> : lectureError ? <p className='text-red-500'>{lectureError.data.message}</p> : lectureData?.lectures?.length === 0 ? <p className='text-gray-500'>No lectures found!</p> : lectureData?.lectures?.map((lecture, index) => (<Lecture key={lecture._id} lecture={lecture} index={index} />))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateLecture