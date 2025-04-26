import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import LectureTab from './LectureTab'

const EditLecture = () => {
    const params = useParams()
    return (
        <div className="p-6">
            <div className="flex gap-3 item-center mb-5">
                <Link to={`/admin/Courses/${params.courseId}/lecture`}>
                    <Button  className='rounded-full hover:cursor-pointer bg-gray-200 text-gray-900 shadow-md hover:bg-gray-300' size="icon">
                        <ArrowLeft size={16} />
                    </Button>
                </Link>
                <h2 className="text-2xl font-semibold mb-2">Update Your Lecture</h2>
            </div>
            <LectureTab/>
        </div>
    )
}

export default EditLecture