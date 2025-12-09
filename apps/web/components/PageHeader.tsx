"use client";

import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { DarkModeToggle } from "@ui/index";
import { useThemeMode } from "../app/providers";

interface Props {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<Props> = ({ title, subtitle }) => {
  const { mode, setMode } = useThemeMode();
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <div>
        <Typography variant="h4" component="h1" fontWeight={700}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </div>
      <DarkModeToggle mode={mode} onToggle={setMode} />
    </Stack>
  );
};

export default PageHeader;
