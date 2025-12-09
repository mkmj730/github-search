import { Button, Avatar } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import HomeHero from "../components/HomeHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 text-sm text-neutral-600 dark:text-neutral-300">
        <div className="flex gap-4">
          <span className="font-medium">GitHub Search</span>
          <span className="hidden sm:inline">Docs</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar sx={{ width: 28, height: 28, bgcolor: "#000" }}>
            <GitHubIcon fontSize="small" />
          </Avatar>
          <Button variant="outlined" size="small" href="https://github.com" target="_blank">
            GitHub
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <HomeHero />
      </div>
    </main>
  );
}
