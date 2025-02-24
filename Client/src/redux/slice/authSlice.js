import { createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios'
import { createAsyncThunk } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
const initialState = {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingUser: true,
    error: null,
    socket: null,
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
export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            return { authUser: res.data };
        } catch (err) {
            console.error("Error in updateProfile:", err);
            return rejectWithValue(err.response?.data || { message: "An error occurred" });
        }
    }
);
export const signup = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/auth/signup', data);
        return { authUser: res.data };
    } catch (err) {
        console.log("error in signup: ", err);
        return rejectWithValue({
            message: err.message,
            code: err.code,
            response: err.response?.data || null,
        });
    }
})
export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/auth/login', data);
        console.log(res.data);
        connectSocket();
        return { authUser: res.data };
    } catch (err) {
        console.log("error in login: ", err);
        return rejectWithValue(err);
    }
})
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {   
    try {
        await axiosInstance.post('/auth/logout');
        disconnectSocket();
        return { authUser: null };
    } catch (err) {
        console.log("error in logout: ", err);
        return rejectWithValue(err);
    }
})
export const connectSocket = () => (dispatch, getState) => {
    try {
        const { auth } = getState();
        if(auth.authUser || auth.socket?.connected) return;
        const socket = io(import.meta.env.VITE_AXIOS_BASE_URL);
        return { socket };
    }
    catch (err) {
        console.log("error in connectSocket: ", err);
    }
}
export const disconnectSocket = () => (dispatch, getState) => {
    try {
        const { auth } = getState();
        if(auth.socket?.connected) auth.socket.disconnect();
        return { socket: null };
    }catch (err) {
        console.log("error in disconnectSocket: ", err);
    }
}
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
            .addCase(signup.pending, (state) => {
                state.isSigningUp = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.authUser = action.payload.authUser;
                state.isSigningUp = false;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isSigningUp = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.authUser = action.payload.authUser;
            })
            .addCase(connectSocket.fulfilled, (state, action) => {
                state.socket = action.payload.socket;
            })
            .addCase(connectSocket.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(disconnectSocket.fulfilled, (state, action) => {
                state.socket = action.payload.socket;
            })
            .addCase(disconnectSocket.rejected, (state, action) => {
                state.error = action.payload;
            })

    },
})

//

export default authSlice.reducer
