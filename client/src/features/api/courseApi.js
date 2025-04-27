import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const course_api = 'https://lms-app-backend-qmqx.onrender.com/course';

export const courseApi = createApi({
    reducerPath:'courseApi',
    tagTypes:['Refetch_Creator_Course','Refetch_lectures'],
    baseQuery: fetchBaseQuery({
        baseUrl: course_api,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({courseTitle,Category}) => ({
                url: '',
                method: 'POST',
                body: {title:courseTitle,category:Category},
            }),
            invalidatesTags: ['Refetch_Creator_Course'],
        }),
        getPublishedCourses: builder.query({
            query: () => ({
                url: '/published-courses',
                method: 'GET',
            }),
        }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: '',
                method: 'GET',
            }),
            providesTags: ['Refetch_Creator_Course'],
        }),
        updateCreatorCourse: builder.mutation({
            query: ({formData,courseId}) => ({
                url: `/${courseId}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Refetch_Creator_Course'],
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: 'GET',
            }),
        }),
        createCourseLecture: builder.mutation({
            query:({courseId,lectureTitle})=>({
                url:`/${courseId}/lecture`,
                method:'POST',
                body:{lectureTitle}
            })
        }),
        getCourseLectures: builder.query({
            query:(courseId)=>({
                url:`/${courseId}/lecture`,
                method:'GET'
            }),
            providesTags:['Refetch_lectures']
        }),
        editCourseLecture:builder.mutation({
            query:({courseId,lectureId,lectureTitle,videoInfo,IsFree})=>({
                url:`/${courseId}/lecture/${lectureId}`,
                method:'POST',
                body:{lectureTitle,videoInfo,IsFree}
            }),
            invalidatesTags:['Refetch_lectures']
        }),
        deleteCourseLecture:builder.mutation({
            query:(lectureId)=>({
                url:`/lecture/${lectureId}`,
                method:'DELETE'
            }),
            invalidatesTags:['Refetch_lectures']
        }),
        getLectureById:builder.query({
            query:(lectureId)=>({
                url:`/lecture/${lectureId}`,
                method:'GET'
            })
        }),
        toggleCoursePublish:builder.mutation({
            query:({courseId,query})=>({
                url:`/${courseId}?publish=${query}`,
                method:'PATCH',
            })
        }),
        searchCourses: builder.query({
            query:({searchQuery , categories , sortPrice})=>{
                const queryString = `/search?query=${encodeURIComponent(searchQuery)}&categories=${categories.map(encodeURIComponent).join(',')}&sortPrice=${encodeURIComponent(sortPrice)}`
                return {
                    url:queryString,
                    method: 'GET',
                }
            }
        })
    })
})

export const {useSearchCoursesQuery,useCreateCourseMutation,useGetCreatorCourseQuery,useUpdateCreatorCourseMutation,useGetCourseByIdQuery,useCreateCourseLectureMutation,useGetCourseLecturesQuery,useEditCourseLectureMutation,useDeleteCourseLectureMutation,useGetLectureByIdQuery,useToggleCoursePublishMutation,useGetPublishedCoursesQuery} = courseApi;
