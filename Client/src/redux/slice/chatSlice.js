import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";



const initialState = {
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    error: null,
    selectedUserData: null,
    messageToSend: {
        text: "",
        audio: null
    },
    aiResponse:"",
    aiLoading:false
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
        console.log("getMessages: runned for ", data._id);
        return { messages: res.data };
    } catch (err) {
        console.log("error in getMessages: ", err);
        return rejectWithValue(err);
    }
});

export const sendMessage = createAsyncThunk('message/send-message', async (data, { rejectWithValue, getState }) => {
    try {
        const state = getState().chat;
        const { selectedUser, messages } = state;
        if (!selectedUser) {
            throw new Error("No user selected");
        }
        const res = await axiosInstance.post(`/message/send-message/${selectedUser}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return { messages: [...messages, res.data] };
    } catch (err) {
        console.log("error in sendMessage: ", err);
        return rejectWithValue(err);
    }
});

export const getAiResponse = createAsyncThunk('message/getAiResponse', async (data, { rejectWithValue}) => {
    try {
        if (!data.userInput) {
            throw new Error("User input is required");
        }
        const res = await axiosInstance.post(`/message/getAiResponse`, data);
        return { aiResponse: res.data };
    } catch (err) {
        console.log("error in getAiResponse: ", err);
        return rejectWithValue(err);
    }
}); 

export const subscribeToMessages = () => (dispatch, getState) => {
    const { chat, auth } = getState();
    if (!chat.selectedUser) {
        return;
    }
    if (!auth.socket) {
        console.error("Socket not available");
        return;
    }
    
   
    
    auth.socket.on('message', (data) => {
        if(data.senderID !== chat.selectedUser) return;
        const currentMessages = getState().chat.messages;
        dispatch(setMessages([...currentMessages, data]));
        console.log("Subscribed to messages", chat.selectedUser);
    });
};
export const unsubscribeToMessages = () => (dispatch, getState) => {
    const { auth } = getState();
    if (auth.socket) {
        auth.socket.off('message'); 
        console.log("Unsubscribed to messages", getState().chat.selectedUser);
    }
   
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setSelectedUserData: (state, action) => {
            state.selectedUserData = action.payload;
        },
        setMessageToSend: (state, action) => {
            state.messageToSend = { ...state.messageToSend, ...action.payload };
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
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
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.error = action.payload;
            }
            )
            .addCase(getAiResponse.pending, (state) => {
                state.aiLoading = true;
            })
            .addCase(getAiResponse.fulfilled, (state, action) => {
                state.aiResponse = action.payload.aiResponse.message;
                state.aiLoading = false;
            })
            .addCase(getAiResponse.rejected, (state, action) => {
                state.aiLoading = false;
                state.error = action.payload;
            })
    },
});

export const { setSelectedUser, setSelectedUserData, setMessageToSend,setMessages } = chatSlice.actions;
export default chatSlice.reducer;