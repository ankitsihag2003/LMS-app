import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const base_api = "http://localhost:8080/api/v1/progress";

export const progressApi = createApi({
    reducerPath: "progressApi",
    baseQuery:fetchBaseQuery({
        baseUrl: base_api,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getCourseProgress: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET",
            }),
        }),
        updateLectureProgress: builder.mutation({
            query: ({courseId, lectureId}) => ({
                url: `/${courseId}/lecture/${lectureId}/view`,
                method: "POST",
            })
        }),
        completeCourse: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}/complete`,
                method: "POST",
            })
        }),
        inCompleteCourse: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}/incomplete`,
                method: "POST",
            })
        })
    }),
})

export const {useGetCourseProgressQuery,useUpdateLectureProgressMutation,useCompleteCourseMutation,useInCompleteCourseMutation} = progressApi;
