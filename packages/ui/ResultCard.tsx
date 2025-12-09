import React, { useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import { GitHubAccount } from "@data/mapper/githubUserMapper";
import { useWasmAvatarRenderer } from "@wasm/avatar_renderer/hook";

export interface ResultCardProps {
  user: GitHubAccount;
}

const ResultCard: React.FC<ResultCardProps> = ({ user }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderAvatar = useWasmAvatarRenderer();

  useEffect(() => {
    if (canvasRef.current) {
      renderAvatar(canvasRef.current, user.avatarUrl);
    }
  }, [renderAvatar, user.avatarUrl]);

  return (
    <Card className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-white/80 dark:bg-slate-900/70">
      <canvas ref={canvasRef} width={96} height={96} className="rounded-xl shadow-md" />
      <div className="flex-1">
        <CardHeader
          title={
            <Link href={user.profileUrl} target="_blank" rel="noreferrer" underline="hover">
              {user.username}
            </Link>
          }
          subheader={`${user.type} • Score ${user.score.toFixed(1)}`}
          className="p-0 mb-2"
        />
        <CardContent className="p-0">
          <Typography variant="body2" color="text.secondary">
            GitHub ID: {user.id}
          </Typography>
          <div className="mt-2 flex gap-2">
            <Chip label={user.type} variant="outlined" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ResultCard;
