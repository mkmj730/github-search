import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export type SortOption = "default" | "followers" | "repositories" | "joined";

export interface SortSelectorProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="sort-label">Sort</InputLabel>
      <Select
        labelId="sort-label"
        value={value}
        label="Sort"
        onChange={(e) => onChange(e.target.value as SortOption)}
      >
        <MenuItem value="default">Best match</MenuItem>
        <MenuItem value="followers">Followers</MenuItem>
        <MenuItem value="repositories">Repositories</MenuItem>
        <MenuItem value="joined">Joined</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortSelector;
