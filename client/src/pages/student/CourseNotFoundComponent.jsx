import React from 'react';

const CourseNotFoundComponent = () => {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-2">No Courses Found</h2>
      <p className="text-muted-foreground">Try adjusting your filters or search for something else!</p>
    </div>
  );
};

export default CourseNotFoundComponent;
