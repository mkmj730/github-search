import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import paginationReducer from "./paginationSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const makeStore = () =>
  configureStore({
    reducer: {
      search: searchReducer,
      pagination: paginationReducer
    }
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
