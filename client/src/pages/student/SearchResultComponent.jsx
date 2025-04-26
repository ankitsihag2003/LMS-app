import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const SearchResultComponent = ({ courses }) => {
    return (
        <div className="space-y-4">
            {courses.map((course) => (
                <Link to={`/course-detail/${course._id}`} className='block'>
                    <Card key={course._id}>
                        <div className="flex flex-col sm:flex-row gap-8 p-4">
                            <img src={course?.courseThumbnail} alt={course?.courseTitle} className="w-60 h-32 md:56 object-cover rounded" />
                            <CardContent className="flex flex-col justify-between p-0">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold">{course?.courseTitle}</h3>
                                    <p className="text-sm text-muted-foreground">{course?.courseSubtitle}</p>
                                    <p className="text-sm mt-1">
                                        Instructor: <span className="font-bold">{course?.creater?.name}</span>
                                    </p>
                                </div>
                                <Badge variant="secondary" className="w-fit mt-2">{course?.courseLevel}</Badge>
                            </CardContent>
                        </div>
                        <div className='ml-4 md:mr-4 md:text-left'>
                            <h1 className='font-bold text-lg md:text-xl'>₹{course.coursePrice}</h1>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
};

export default SearchResultComponent;
