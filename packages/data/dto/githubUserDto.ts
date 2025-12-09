export interface GitHubUserDTO {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: "User" | "Organization";
  score: number;
}

export interface SearchUsersResponseDTO {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUserDTO[];
}
