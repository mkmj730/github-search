import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import PlaceIcon from "@mui/icons-material/Place";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FavoriteIcon from "@mui/icons-material/Favorite";

export interface FilterState {
  location: string;
  language: string;
  repos: string;
  followers: string;
  created: string;
  sponsor: boolean;
  inName: boolean;
  inEmail: boolean;
  type: "any" | "user" | "org";
}

export interface FilterPanelProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  disabled?: boolean;
  activeCount?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ value, onChange, onApply, onReset, disabled, activeCount = 0 }) => {
  const handleChange =
    (key: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const next: FilterState = { ...value, [key]: e.target.value };
      onChange(next);
    };

  const countries = ["", "United States", "United Kingdom", "Germany", "France", "Korea", "Japan", "India", "Canada", "Australia"];
  const languages = ["", "TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "C#", "C++", "PHP"];

  return (
    <Paper className="p-4 space-y-4" variant="outlined">
      <div className="flex items-center justify-between">
        <Typography variant="subtitle1" className="font-semibold">
          Filters
        </Typography>
        <Badge color={activeCount > 0 ? "primary" : "default"} badgeContent={activeCount} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Autocomplete
          options={countries}
          value={value.location}
          onChange={(_, newVal) => onChange({ ...value, location: newVal ?? "" })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Location"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          )}
          disableClearable
          disabled={disabled}
        />
        <Autocomplete
          options={languages}
          value={value.language}
          onChange={(_, newVal) => onChange({ ...value, language: newVal ?? "" })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Language"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <CodeIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          )}
          disableClearable
          disabled={disabled}
        />
        <TextField
          label="Repos filter (e.g. >10)"
          value={value.repos}
          onChange={handleChange("repos")}
          disabled={disabled}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <StorageIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Followers filter (e.g. >=100)"
          value={value.followers}
          onChange={handleChange("followers")}
          disabled={disabled}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GroupsIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Created"
          value={value.created}
          onChange={handleChange("created")}
          disabled={disabled}
          type="date"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />
        <Paper
          variant="outlined"
          className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-wrap items-center justify-between px-3 py-2 gap-2"
        >
          <Typography variant="body2" className="font-semibold">
            Account type
          </Typography>
          <ToggleButtonGroup
            value={value.type}
            exclusive
            onChange={(_, val) => val && onChange({ ...value, type: val })}
            size="small"
            color="primary"
            disabled={disabled}
          >
            <ToggleButton value="any">Any</ToggleButton>
            <ToggleButton value="user">User</ToggleButton>
            <ToggleButton value="org">Org</ToggleButton>
          </ToggleButtonGroup>
        </Paper>
        <Paper variant="outlined" className="col-span-1 sm:col-span-2 lg:col-span-3 p-3 space-y-2">
          <Typography variant="body2" className="font-semibold">
            Search in
          </Typography>
          <ToggleButtonGroup
            value={[
              ...(value.inName ? ["name"] : []),
              ...(value.inEmail ? ["email"] : []),
              ...(value.sponsor ? ["sponsor"] : [])
            ]}
            onChange={(_, vals) => {
              onChange({
                ...value,
                inName: vals.includes("name"),
                inEmail: vals.includes("email"),
                sponsor: vals.includes("sponsor")
              });
            }}
            color="primary"
            size="small"
            aria-label="search in"
          >
            <ToggleButton value="name" aria-label="search name">
              Name
            </ToggleButton>
            <ToggleButton value="email" aria-label="search email">
              Email
            </ToggleButton>
            <ToggleButton value="sponsor" aria-label="sponsorable">
              <FavoriteIcon fontSize="small" className="mr-1" /> Sponsor
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </div>
      <Divider />
      <div className="flex gap-2 justify-end">
        <Button
          variant="outlined"
          onClick={onReset}
          disabled={disabled}
          data-testid="filter-reset-button"
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={onApply}
          disabled={disabled}
          data-testid="filter-apply-button"
        >
          Apply
        </Button>
      </div>
    </Paper>
  );
};

export default FilterPanel;
