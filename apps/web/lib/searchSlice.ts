import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SortOption } from "@ui/SortSelector";

export interface FiltersState {
  location: string;
  language: string;
  repos: string;
  followers: string;
  sponsor: boolean;
  created: string;
  inName: boolean;
  inEmail: boolean;
  type: "any" | "user" | "org";
}

export interface SearchState {
  keyword: string;
  filters: FiltersState;
  sort: SortOption;
}

const initialState: SearchState = {
  keyword: "",
  filters: {
    location: "",
    language: "",
    repos: "",
    followers: "",
    sponsor: false,
    created: "",
    inName: true,
    inEmail: false,
    type: "any"
  },
  sort: "default"
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    setFilters: (state, action: PayloadAction<FiltersState>) => {
      state.filters = action.payload;
    },
    setSort: (state, action: PayloadAction<SortOption>) => {
      state.sort = action.payload;
    },
    resetSearch: () => initialState
  }
});

export const { setKeyword, setFilters, setSort, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
