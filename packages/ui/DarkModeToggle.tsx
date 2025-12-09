import React from "react";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export interface DarkModeToggleProps {
  mode: "light" | "dark" | "system";
  onToggle: (next: "light" | "dark" | "system") => void;
}

const order: Array<"light" | "dark" | "system"> = ["system", "light", "dark"];

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ mode, onToggle }) => {
  const handleClick = () => {
    const idx = order.indexOf(mode);
    const next = order[(idx + 1) % order.length];
    onToggle(next);
  };

  return (
    <Tooltip title={`Theme: ${mode}`}>
      <IconButton onClick={handleClick} color="inherit">
        {mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
