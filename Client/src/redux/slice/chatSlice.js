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
        Toast.Error("Error in AI response");
        return rejectWithValue(err);
    }
}); 

export const deleteMessage = createAsyncThunk('message/delete-message', async ({data,toast}, { rejectWithValue, getState }) => {
    
    try {
        const state = getState().chat;
        const { authUser } = getState().auth;
        const { selectedUser, messages } = state;
        if (!selectedUser) {
            throw new Error("No user selected");
        }
        if (data.senderID !== authUser._id) {
            throw new Error("You are not authorized to delete this message");
        }
        await axiosInstance.delete(`/message/delete-message`, {
            data: { _id: data._id }
        });
        toast({
            description: "Your message has been sent.",
          });
        return { messages: messages.filter(message => message._id !== data._id) };
    } catch (err) {
        console.log("error in deleteMessage: ", err);
        return rejectWithValue(err);
    }
});

// Socket listener for message updates


export const subscribeToMessages = () => (dispatch, getState) => {
    const { chat, auth } = getState();
    if (!chat.selectedUser || !auth.socket) {
        return;
    }

    
    auth.socket.on('message', (data) => {
        if(data.senderID !== chat.selectedUser) return;
        const currentMessages = getState().chat.messages;
        dispatch(setMessages([...currentMessages, data]));
        console.log("Subscribed to messages", chat.selectedUser);
    });
    auth.socket.on('messageDeleted', (data) => {
        const currentMessages = getState().chat.messages;
        dispatch(setMessages(currentMessages.filter(message => message._id !== data._id)));
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
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages = action.payload.messages;
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.error = action.payload;
            });
            
    },
});

export const { setSelectedUser, setSelectedUserData, setMessageToSend,setMessages } = chatSlice.actions;
export default chatSlice.reducer;