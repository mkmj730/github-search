import { mapGitHubUser, mapGitHubUsers } from "./githubUserMapper";

const dto = {
  login: "octocat",
  id: 1,
  avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
  html_url: "https://github.com/octocat",
  type: "User" as const,
  score: 99.9
};

describe("GitHubUserMapper", () => {
  it("maps single dto", () => {
    const result = mapGitHubUser(dto);
    expect(result).toEqual({
      username: "octocat",
      id: 1,
      avatarUrl: dto.avatar_url,
      profileUrl: dto.html_url,
      type: "User",
      score: 99.9
    });
  });

  it("maps a collection", () => {
    const result = mapGitHubUsers([dto, { ...dto, login: "hubot", id: 2 }]);
    expect(result).toHaveLength(2);
    expect(result[1].username).toBe("hubot");
  });
});
