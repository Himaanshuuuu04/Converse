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
    selectedUserData: null
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


export const getMessages = createAsyncThunk('message/messages', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/message/${data._id}`);
        console.log("res in getMessages: ", res);
        return { messages: res.data };
    } catch (err) {
        console.log("error in getMessages: ", err);
        return rejectWithValue(err);
    }
});

export const sendMessage = createAsyncThunk('message/send-message', async (data, { rejectWithValue }) => {
    try {
        const state = select.getState().chat;
        const { selectedUser, messages } = state;
        if (!selectedUser) {
            throw new Error("No user selected");
        }
        const res = await axiosInstance.post(`/message/send-message/${selectedUser._id}`, data);
        return { messages: [...messages, res.data] };
    } catch (err) {
        console.log("error in sendMessage: ", err);
        return rejectWithValue(err);
    }
});




export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setSelectedUserData: (state, action) => {
            state.selectedUserData = action.payload;
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
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages = action.payload.messages;
            });
    },
});

export const { setSelectedUser, setSelectedUserData } = chatSlice.actions;
export default chatSlice.reducer;