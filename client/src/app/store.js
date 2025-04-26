import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../app/root.js";
import { authApi } from "@/features/api/authApi.js";
import { courseApi } from "@/features/api/courseApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { progressApi } from "@/features/api/courseProgressApi.js";

export const appStore = configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(authApi.middleware,courseApi.middleware,purchaseApi.middleware,progressApi.middleware),
});
const initializeApp = async () => {
    const state = appStore.getState();
    await appStore.dispatch(authApi.endpoints.getUser.initiate({}, { forceRefetch: true }));
};
initializeApp();
