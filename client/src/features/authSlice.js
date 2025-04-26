import { createSlice } from "@reduxjs/toolkit";

const initial_state = {
    user : null,
    isAuthenticated : false
}

const authSlice = createSlice({
    name:"authSlice",
    initialState:initial_state,
    reducers:{
        userLoggedIn : (state,action)=>{
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        userLoggedOut : (state)=>{
            state.user = null;
            state.isAuthenticated = false;
        }
    }
});

export const {userLoggedIn,userLoggedOut}=authSlice.actions;
export default authSlice.reducer;