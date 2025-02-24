import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import chatReducer from "./slice/chatSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['auth.socket'],  // Ignore socket path in state
                ignoredActions: ['auth/setSocket'],  // Ignore setSocket action
            },
        }),
})  