import { createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { set } from 'react-hook-form';


const initialState = {
    receivedOffer: null,
    callerID: null,
    callerData: null,
    outgoingCall: false,
    incomingCall:false,
    callAccepted: false,
    callRejected: false,
    callEnded: false,
    incomingOffer: null,
    error: null,
};

export const generateCall = createAsyncThunk('message/generateCall', async ({toast,offer,id}, { rejectWithValue, getState }) => {
    try {
        const res = await axiosInstance.post('/message/generateCall',{
            id:id,
            offer:offer
        });
        console.log("callUser: ", res.data);
        return { receiverSocketID: res.data.receiverSocketID };
    } catch (err) {
        console.log("error in call: ", err);
        toast({
            variant: "destructive",
            title: "Calling is only available to Online Users",
            description: err.response.data.message,
        });
        return rejectWithValue(err);
    }
});

export const acceptCall = createAsyncThunk('message/acceptCall', async ({toast,answer}, { rejectWithValue, getState }) => {
    try {
        const {chat} = getState();
        const res = await axiosInstance.post('/message/acceptCall',{
            id:chat.selectedUser,
            answer:answer
        });
        console.log("acceptCall: ", res.data);
        return { receiverSocketID: res.data.receiverSocketID };
    } catch (err) {
        console.log("error in acceptCall: ", err);
        toast({
            variant: "destructive",
            title: "Error in accepting call",
            description: err.response.data.message,
        });
        return rejectWithValue(err);
    }
});

export const rejectCall = createAsyncThunk('message/rejectCall', async ({toast}, { rejectWithValue, getState }) => {
    try {
        const {call} = getState();
        await axiosInstance.post('/message/rejectCall',{
            id:call.callerID
        });
        return;
    } catch (err) {
        console.log("error in rejectCall: ", err);
        toast({
            variant: "destructive",
            title: "Error in rejecting call",
            description: err.response.data.message,
        });
        return rejectWithValue(err);
    }
});

export const endCall = createAsyncThunk('message/endCall', async ({toast,navigate}, { rejectWithValue, getState }) => {
    try {
        const  {call} = getState();
        await axiosInstance.post('/message/endCall', {id:call.callerID});
        if (typeof toast === 'function') {
            toast({
                // variant: "success",
                title: "Call ended successfully",
            });
        }
        navigate('/');
        return;
    } catch (err) {
        console.log("error in endCall: ", err);
        return rejectWithValue(err);
    }
});


// export const connectSocket = () => (dispatch, getState) => {
//     const { auth } = getState();
//     if (auth.authUser && !auth.socket) {
//         const socket = io(import.meta.env.VITE_AXIOS_BASE_URL,{
//             query:{
//                 userID:auth.authUser._id
//             },
//         });
//         socket.on('connect', () => {
//             console.log("✅ Socket connected successfully.");
//         });
//         socket.on('getOnlineUsers', (userIds) => {
//             dispatch(setOnlineUsers({ onlineUsers: userIds }));
//         });
//         socket.on('callFromUser', (data) => {
//             dispatch(setCallFromUser({ offer: data.offer, senderID: data.senderID }));
//             console.log("Call from user:", data);
//         }
//         );
//         socket.on('callAccepted', (data) => {
//             setCallAccepted();
//             console.log("Call accepted:", data);
//         }
//         );
//         socket.on('callRejected', (data) => {
//             console.log("Call rejected:", data);
//         }
//         );
//         socket.on('callEnded', (data) => {
//             console.log("Call ended:", data);
//         }
//         );
//         socket.on('error', (err) => {
//             console.error("Socket error:", err);
//         }
//         );
//         console.log(socket)
//         dispatch(setSocket({ socket }));
//         socket.on('disconnect', () => {
//             console.log("❌ Socket disconnected.");
//         });
//     }
// };

// export const disconnectSocket = () => (dispatch, getState) => {
//     const { auth } = getState();
//     if (auth.socket?.connected) {
//         auth.socket.disconnect();
//         dispatch(setSocket({ socket: null }));
//     }
// };

export const callSlice = createSlice({
    name: 'call',
    initialState,
    reducers: {
        setOutgoingCall: (state, action) => {
            state.outgoingCall = action.payload;
        },
        setCallerData: (state, action) => {
            state.callerData = action.payload;
        },
        setIncomingCallerID: (state, action) => {
            state.callerID = action.payload;
        },
        setIncomingCall: (state, action) => {
            state.incomingCall = action.payload;
        },
        setIncomingOffer: (state, action) => {
            state.incomingOffer = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(generateCall.fulfilled, (state, action) => {
            state.callerID = action.payload.receiverID;
        })
        .addCase(generateCall.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(acceptCall.fulfilled, (state, action) => {
            state.callerID = action.payload.receiverSocketID;
            state.incomingCall = false;
            state.callAccepted = true;
        })
        .addCase(acceptCall.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(endCall.fulfilled, (state) => {
            state.callerID = null;
            state.callerData=null;
            state.outgoingCall = false;
            state.incomingCall = false;
            state.callAccepted = false;
            state.callRejected = false;
            state.callEnded = true;
        })
        .addCase(endCall.rejected, (state, action) => {
            state.error = action.payload;
        });
    },
});

export const {setOutgoingCall,setCallerData,setIncomingCall,setIncomingOffer,setIncomingCallerID} = callSlice.actions;
export default callSlice.reducer;
