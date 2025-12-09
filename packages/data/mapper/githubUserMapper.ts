import { GitHubUserDTO } from "../dto/githubUserDto";

export interface GitHubAccount {
  username: string;
  id: number;
  avatarUrl: string;
  profileUrl: string;
  type: "User" | "Organization";
  score: number;
}

export const mapGitHubUser = (dto: GitHubUserDTO): GitHubAccount => ({
  username: dto.login,
  id: dto.id,
  avatarUrl: dto.avatar_url,
  profileUrl: dto.html_url,
  type: dto.type,
  score: dto.score
});

export const mapGitHubUsers = (dtos: GitHubUserDTO[]): GitHubAccount[] => dtos.map(mapGitHubUser);
