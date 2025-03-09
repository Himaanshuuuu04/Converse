import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
  receivedOffer: null,
  callerID: null,
  callerData: null,
  outgoingCall: false,
  incomingCall: false,
  callAccepted: false,
  callRejected: false,
  callEnded: false,
  incomingOffer: null,
  error: null,
};

export const generateCall = createAsyncThunk(
  "message/generateCall",
  async ({ toast, offer, id}, { rejectWithValue, getState }) => {
    
    try {
      const  authUser = getState().auth.authUser;
      
      const senderData = {
        id: authUser._id,
        fullName: authUser.fullName,
        profileImage: authUser.profileImage,
      };
      
      console.log("id for generateCall: ", id);
      const res = await axiosInstance.post("/message/generateCall", {
        id: id,
        offer: offer,
        senderData: senderData,
      });
      console.log("callUser: ", res.data);
      return { receiverID: res.data.receiverID };
    } catch (err) {
      console.log("error in call: ", err);
      toast({
        variant: "destructive",
        title: "Calling is only available to Online Users",
        description: err.response.data.message,
      });
      return rejectWithValue(err);
    }
  }
);

export const acceptCall = createAsyncThunk(
  "message/acceptCall",
  async ({ toast, answer }, { rejectWithValue, getState }) => {
    try {
      const { chat } = getState();
      const res = await axiosInstance.post("/message/acceptCall", {
        id: chat.selectedUser,
        answer: answer,
      });
      console.log("acceptCall: ", res.data);
      return;
    } catch (err) {
      console.log("error in acceptCall: ", err);
      toast({
        variant: "destructive",
        title: "Error in accepting call",
        description: err.response.data.message,
      });
      return rejectWithValue(err);
    }
  }
);

export const rejectCall = createAsyncThunk(
  "message/rejectCall",
  async ({ toast, id }, { rejectWithValue, getState }) => {
    try {
      await axiosInstance.post("/message/rejectCall", {
        id: id,
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
  }
);

export const endCall = createAsyncThunk(
  "message/endCall",
  async ({ toast, navigate }, { rejectWithValue, getState }) => {
    try {
      const { call } = getState();
      await axiosInstance.post("/message/endCall", { id: call.callerID });
      if (typeof toast === "function") {
        toast({
          // variant: "success",
          title: "Call ended successfully",
        });
      }
      navigate("/");
      return;
    } catch (err) {
      console.log("error in endCall: ", err);
      return rejectWithValue(err);
    }
  }
);


export const callSlice = createSlice({
  name: "call",
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
    },
    setCallAccepted: (state, action) => {
      state.callAccepted = action.payload;
    },
    setCallRejected: (state, action) => {
      state.callRejected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateCall.fulfilled, (state, action) => {
        state.callerID = action.payload.receiverID;
      })
      .addCase(generateCall.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(acceptCall.fulfilled, (state) => {
        state.incomingCall = false;
        state.callAccepted = true;
      })
      .addCase(acceptCall.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(rejectCall.fulfilled, (state) => {
        state.incomingCall = false;
        state.callRejected = true;
      })
      .addCase(rejectCall.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(endCall.fulfilled, (state) => {
        state.callerID = null;
        state.callerData = null;
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

export const {
  setOutgoingCall,
  setCallerData,
  setIncomingCall,
  setIncomingOffer,
  setIncomingCallerID,
  setCallAccepted,
  setCallRejected,
} = callSlice.actions;
export default callSlice.reducer;
