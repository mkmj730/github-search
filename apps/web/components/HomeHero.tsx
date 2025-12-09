"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { Button, TextField, Avatar, Stack, Paper, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useRouter } from "next/navigation";

const HomeHero: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = keyword.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 gap-6">
      <div className="flex items-center gap-3">
        <Avatar sx={{ bgcolor: "#000", width: 56, height: 56 }}>
          <GitHubIcon fontSize="large" />
        </Avatar>
        <Typography variant="h3" fontWeight={700}>
          GitHub Search
        </Typography>
      </div>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={2}
        className="w-full max-w-3xl p-3 rounded-full shadow-lg bg-white dark:bg-neutral-900"
      >
        <div className="flex items-center gap-2">
          <SearchIcon className="text-neutral-500" />
          <TextField
            fullWidth
            placeholder="Search GitHub users or organizations"
            variant="standard"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
          <Button variant="contained" className="rounded-full px-4" type="submit">
            Search
          </Button>
        </div>
      </Paper>
      <Stack direction="row" spacing={2}>
        <Link href="/search">
          <Button variant="outlined">Go to Search</Button>
        </Link>
        <Button variant="text" onClick={() => router.push("/search")}>
          I’m Feeling Lucky
        </Button>
      </Stack>
    </div>
  );
};

export default HomeHero;
