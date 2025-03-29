"use client";
import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import React from "react";
import { Provider } from "react-redux";
import { api } from "./api";

const globalSlice = createSlice({
  name: "global",
  initialState: [],
  reducers: {},
});
const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const customCombineReducers = combineReducers({
    [api.reducerPath]: api.reducer,
    global: globalSlice.actions,
  });
  const store = configureStore({
    reducer: customCombineReducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
