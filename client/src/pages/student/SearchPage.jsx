import React, { useState } from 'react';
import FilterComponent from './FilterComponent';
import SearchResultComponent from './SearchResultComponent';
import CourseNotFoundComponent from './CourseNotFoundComponent';
import { useSearchCoursesQuery } from '@/features/api/courseApi';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [categories, setcategories] = useState([])  
  const [sortPrice, setsortPrice] = useState("")


  const {data,isLoading}=useSearchCoursesQuery({searchQuery:query , categories,sortPrice});
  const hasCourses = !isLoading && data?.courses?.length > 0;

  const handleFilterChange = (categories,price) => {
    setcategories(categories);
    setsortPrice(price);
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-3">
        <div>
            <p className='font-bold text-xl md:text-2xl'>result for {query}</p>
            <p>Showing result for{" "} <span className='text-blue-800 font-bold italic'>{query}</span></p> 
        </div>
        <FilterComponent handleFilterChange={handleFilterChange} />
      </div>
      <div className="md:col-span-3">
        {isLoading ? (
          <SkeletonComponent data={data}/>
        ) : hasCourses ? (
          <SearchResultComponent courses={data.courses}/>
        ) : (
          <CourseNotFoundComponent/>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

const SkeletonComponent = ({data}) => {
    return (
      <div className="space-y-4">
        {data?.courses?.map((course) => (
          <Card key={course._id} className="flex gap-4 p-4">
            <Skeleton className="w-32 h-20 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  };