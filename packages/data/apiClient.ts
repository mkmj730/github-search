import { buildSearchQuery, SearchQueryInput } from "@core/usecases/searchQueryBuilder";
import { mapGitHubUsers, GitHubAccount } from "./mapper/githubUserMapper";
import { SearchUsersResponseDTO } from "./dto/githubUserDto";
import { fetchWithRateLimit } from "./rateLimitHandler";

export interface SearchParams {
  filters: SearchQueryInput;
  page?: number;
  perPage?: number;
  sort?: "followers" | "repositories" | "joined";
  order?: "desc";
}

export interface SearchResult {
  totalCount: number;
  items: GitHubAccount[];
  rateLimitRemaining: number;
}

const BASE_URL = "https://api.github.com";

export const searchGitHubUsers = async (params: SearchParams): Promise<SearchResult> => {
  const query = buildSearchQuery(params.filters);
  const search = new URLSearchParams();
  search.set("q", query);
  if (params.sort) search.set("sort", params.sort);
  if (params.order) search.set("order", params.order);
  search.set("page", String(params.page ?? 1));
  search.set("per_page", String(params.perPage ?? 20));

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (token) headers.Authorization = `token ${token}`;

  const fetcher =
    (typeof fetch !== "undefined" ? fetch : (await import("node-fetch")).default) as any;
  const { response, rateLimit } = await fetchWithRateLimit(
    fetcher,
    `${BASE_URL}/search/users?${search.toString()}`,
    {
      headers
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${text}`);
  }

  const data = (await response.json()) as SearchUsersResponseDTO;
  return {
    totalCount: data.total_count,
    items: mapGitHubUsers(data.items),
    rateLimitRemaining: rateLimit.remaining
  };
};
