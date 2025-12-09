import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSubmit, placeholder }) => (
  <div className="flex items-center gap-3 w-full">
    <TextField
      fullWidth
      value={value}
      placeholder={placeholder ?? "Search GitHub users"}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
    <Button variant="contained" color="primary" onClick={onSubmit}>
      Search
    </Button>
  </div>
);

export default SearchBar;
