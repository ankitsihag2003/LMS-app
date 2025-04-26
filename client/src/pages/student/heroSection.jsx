import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

  const [searchQuery, setsearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(searchQuery.trim() !== ''){
      navigate(`/course/search?query=${searchQuery}`)
    }
    setsearchQuery("")
  }

  return (
    <section className='relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-16 px-4 dark:from-gray-800 dark:to-gray-900'>
      <div className='mx-auto max-w-3xl'>
        <h1 className='text-4xl font-bold mb-4'>Learn Without Limits</h1>
        <p className='text-lg mb-4'>
          Explore, Enroll, and Empower yourself with top-rated online courses.
        </p>
        <form onSubmit={handleSubmit} className='flex justify-center items-center max-w-[550px] mx-auto mb-6'>
          <input type="text"
            placeholder='What do you want to learn?'
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)}
            className='rounded-full bg-white focus:outline-none text-gray-800 w-full px-5 py-3'
          />
          <button type='submit' className='bg-indigo-700 text-white font-semibold rounded-l-none rounded-full px-5 py-3 -ml-11 hover:bg-indigo-800 transition cursor-pointer dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400'>Search</button>
        </form>
        <button onClick={()=>navigate(`/course/search?query`)} className="mt-4 px-6 py-3 bg-indigo-700 hover:bg-indigo-800 rounded-full font-medium transition dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400 cursor-pointer">
          Browse All Courses
        </button>
      </div>
    </section>
  )
}

export default HeroSection;