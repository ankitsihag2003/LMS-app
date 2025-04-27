import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const base_api = "https://lms-app-backend-qmqx.onrender.com/purchase/";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: base_api,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: (courseId) => ({
                url: `/checkout/create-checkout-session`,
                method: "POST",
                body: { courseId },
            }),
        }),
        getCourseDetailWithStatus: builder.query({
            query: (courseId) => ({
                url: `course/${courseId}/detail-with-status`,
                method: "GET",
            })
            
        }),
        getAllPurchasedCourses: builder.query({
            query: () => ({
                url: "/",
                method: "GET",
            })
        })
    })
})

export const { useCreateCheckoutSessionMutation,useGetCourseDetailWithStatusQuery,useGetAllPurchasedCoursesQuery } = purchaseApi;
