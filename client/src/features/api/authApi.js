import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const User_api = "http://localhost:8080/api/v1/user/";

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:User_api,
        credentials:'include',
    }),
    endpoints:(builder)=>({
        registerUser : builder.mutation({
            query:(inputData)=>({
                url:'register',
                method:'POST',
                body:inputData
            })
        }),
        loginUser : builder.mutation({
            query:(inputData)=>({
                url:'login',
                method:'POST',
                body:inputData
            }),
            async onQueryStarted(_,{dispatch , queryFulfilled}){
                try {
                    const result = await queryFulfilled;
                    await dispatch(userLoggedIn({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        getUser:builder.query({
            query:()=>({
                url:"profile",
                method:"GET"
            }),
            async onQueryStarted(_,{dispatch , queryFulfilled}){
                try {
                    const result = await queryFulfilled;
                    await dispatch(userLoggedIn({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        updateUser:builder.mutation({
            query:(formData)=>({
                url:'profile/update',
                method:'PUT',
                body:formData,
                credentials:'include'
            })
        }),
        logoutUser:builder.mutation({
            query:()=>({
                url:'logout',
                method:'GET',
                credentials:'include'
            }),
            async onQueryStarted(_,{dispatch , queryFulfilled}){
                try {
                    await dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            }
        })
    })
}) 
export const {useRegisterUserMutation,useLoginUserMutation,useLogoutUserQuery,useGetUserQuery,useUpdateUserMutation,useLogoutUserMutation} = authApi;
