import { createSlice } from '@reduxjs/toolkit';
import {axiosInstance} from '../../lib/axios'
import { createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingUser: true,
    error: null
};

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/auth/check');
        return { authUser: res.data };
    } catch (err) {
        console.log("error in checkAuth: ", err);
        return rejectWithValue(err);
    }
});
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(checkAuth.pending, (state) => {
            state.isCheckingUser = true;
        })
        .addCase(checkAuth.fulfilled, (state,action) => {
            state.authUser = action.payload.authUser;
            state.isCheckingUser = false;
        })
        .addCase(checkAuth.rejected, (state,action) => {
            state.isCheckingUser = false;
            state.error = action.payload;
        })
        
    },
})
  
  //
  
  export default authSlice.reducer
         