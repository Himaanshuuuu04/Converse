import { createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios'
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
export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.put('/auth/update', data);
        return { authUser: res.data };
    } catch (err) {
        console.log("error in updateProfile: ", err);
        return rejectWithValue(err);
    }
})
export const signup = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
    try {
        console.log("data at authSlice:");
        console.log(data);
        const res = await axiosInstance.post('/auth/signup', data);
        console.log(res.data);
        return { authUser: res.data };
    } catch (err) {
        console.log("error in signup: ", err);
        return rejectWithValue(err);
    }
})
export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/auth/login', data);
        return { authUser: res.data };
    } catch (err) {
        console.log("error in login: ", err);
        return rejectWithValue(err);
    }
})
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
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.authUser = action.payload.authUser;
                state.isCheckingUser = false;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isCheckingUser = false;
                state.error = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isUpdatingProfile = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.authUser = action.payload.authUser;
                state.isUpdatingProfile = false;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isUpdatingProfile = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.isLoggingIn = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.authUser = action.payload.authUser;
                state.isLoggingIn = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggingIn = false;
                state.error = action.payload;
            })
    },
})

//

export default authSlice.reducer
