import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Lecture = ({key,lecture,index}) => {
    const navigate = useNavigate();
  return (
    <div className='bg-gray-200 text-gray-900 px-3 py-1 max-w-4xl rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200'>
        <div className="flex justify-between items-center">
            <h2 className='font-bold text-[17px]'>Lecture-{index+1}: <span>{lecture.lectureTitle}</span> </h2>
            <Button variant="link" className="cursor-pointer" onClick={()=> navigate(`${lecture._id}`)}>Edit</Button>
        </div>
    </div>
  )
}

export default Lecture