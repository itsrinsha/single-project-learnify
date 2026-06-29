// redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import courseReducer from "../features/courses/courseSlice";
import studentReducer from "../features/student/studentSlice";

import {
  persistStore,
  persistReducer,
} from "redux-persist";

import storage from 'redux-persist/lib/storage';
const realStorage = storage.default;
import instructorReducer from "../features/instructor/instructorSlice";

// 🔹 persist config
const persistConfig = {
  key: "auth",
  storage: realStorage,
  whitelist: ["user", "isAuthenticated"],
};
// console.log("storage", storage)
// 🔹 persisted reducer
const persistedReducer = persistReducer(persistConfig, authReducer);

// 🔹 store
export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    courses: courseReducer,
    student: studentReducer,
    instructor: instructorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.MODE !== "production",
});

// 🔹 persistor
export const persistor = persistStore(store);