import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PaginationStatus = "idle" | "loading" | "error";

export interface PaginationState {
  page: number;
  status: PaginationStatus;
  error?: string;
  hasMore: boolean;
}

const initialState: PaginationState = {
  page: 1,
  status: "idle",
  hasMore: true
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    resetPagination: () => initialState,
    nextPage: (state) => {
      state.page += 1;
    },
    setStatus: (state, action: PayloadAction<PaginationStatus>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
      state.status = action.payload ? "error" : "idle";
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    }
  }
});

export const { resetPagination, nextPage, setStatus, setError, setHasMore } = paginationSlice.actions;
export default paginationSlice.reducer;
