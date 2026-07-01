// redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import courseReducer from "../features/courses/courseSlice";
import studentReducer from "../features/student/studentSlice";

import {
  persistStore,
  persistReducer,
} from "redux-persist";

import instructorReducer from "../features/instructor/instructorSlice";

// Custom storage adapter for Vite compatibility
const customStorage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, item) => {
    window.localStorage.setItem(key, item);
    return Promise.resolve();
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// 🔹 persist config
const persistConfig = {
  key: "auth",
  storage: customStorage,
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