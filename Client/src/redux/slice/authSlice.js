import { createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
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

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue ,dispatch}) => {
    try {
        const res = await axiosInstance.get('/auth/check');
        dispatch(connectSocket());
        return { authUser: res.data };
    } catch (err) {
        console.error("Error in checkAuth:", err);
        return rejectWithValue(err);
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.put('/auth/update-profile', data, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return { authUser: res.data };
    } catch (err) {
        console.error("Error in updateProfile:", err);
        return rejectWithValue(err.response?.data || { message: "An error occurred" });
    }
});

export const signup = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/auth/signup', data);
        return { authUser: res.data };
    } catch (err) {
        console.error("Error in signup:", err);
        return rejectWithValue({
            message: err.message,
            code: err.code,
            response: err.response?.data || null,
        });
    }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue, dispatch }) => {
    try {
        const res = await axiosInstance.post('/auth/login', data);
        dispatch(connectSocket());
        return { authUser: res.data };
    } catch (err) {
        console.error("Error in login:", err);
        return rejectWithValue(err);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue, dispatch }) => {
    try {
        await axiosInstance.post('/auth/logout');
        dispatch(disconnectSocket());
        return { authUser: null };
    } catch (err) {
        console.error("Error in logout:", err);
        return rejectWithValue(err);
    }
});

export const connectSocket = () => (dispatch, getState) => {
    const { auth } = getState();
    if (auth.authUser && !auth.socket) {
        const socket = io(import.meta.env.VITE_AXIOS_BASE_URL);
        dispatch(setSocket(socket));

        socket.on('connect', () => {
            console.log("✅ Socket connected successfully.");
        });

        socket.on('disconnect', () => {
            console.log("❌ Socket disconnected.");
        });
    }
};

export const disconnectSocket = () => (dispatch, getState) => {
    const { auth } = getState();
    if (auth.socket?.connected) {
        auth.socket.disconnect();
        dispatch(setSocket(null));
    }
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
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
            .addCase(logout.fulfilled, (state) => {
                state.authUser = null;
                state.socket = null;
            });
    },
});

export const { setSocket } = authSlice.actions;
export default authSlice.reducer;
