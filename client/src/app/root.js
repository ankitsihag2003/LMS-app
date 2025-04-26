import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authApi.js";
import { courseApi } from "@/features/api/courseApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { progressApi } from "@/features/api/courseProgressApi.js";

const rootReducer = combineReducers({
    auth : authReducer,
    [authApi.reducerPath] : authApi.reducer,
    [courseApi.reducerPath] : courseApi.reducer,
    [purchaseApi.reducerPath] : purchaseApi.reducer,
    [progressApi.reducerPath] : progressApi.reducer,
});
export default rootReducer;