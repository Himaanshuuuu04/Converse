import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { select } from "@heroui/react";
import { set } from "react-hook-form";

const initialState = {
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    error: null,
};

export const getUsers = createAsyncThunk('message/users', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/message/users');
        return { users: res.data };
    } catch (err) {
        console.log("error in getUsers: ", err);
        return rejectWithValue(err);
    }
});

export const getMessages = createAsyncThunk('message/id', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/message/${data.id}`);
        return { messages: res.data };
    } catch (err) {
        console.log("error in getMessages: ", err);
        return rejectWithValue(err);
    }
});

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            console.log("selected user: ", action.payload);
            state.selectedUser = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isUserLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload.users;
                state.isUserLoading = false;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isUserLoading = false;
                state.error = action.payload;
            })
            .addCase(getMessages.pending, (state) => {
                state.isMessageLoading = true;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.messages = action.payload.messages;
                state.isMessageLoading = false;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.isMessageLoading = false;
                state.error = action.payload;
            })
    },
});

export const { setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;