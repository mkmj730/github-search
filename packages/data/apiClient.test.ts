import { searchGitHubUsers } from "./apiClient";
import * as builder from "@core/usecases/searchQueryBuilder";

describe("searchGitHubUsers", () => {
  it("builds URL with query and sort", async () => {
    const spyQuery = jest.spyOn(builder, "buildSearchQuery").mockReturnValue("penguin");
    const fetchMock = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          total_count: 1,
          incomplete_results: false,
          items: [
            {
              login: "penguin",
              id: 1,
              avatar_url: "https://x/p.png",
              html_url: "https://github.com/penguin",
              type: "User",
              score: 1
            }
          ]
        }),
        {
          status: 200,
          headers: new Headers({ "x-ratelimit-remaining": "59" })
        }
      )
    );
    // override global fetch for test
    global.fetch = fetchMock as any;

    const result = await searchGitHubUsers({
      filters: { keyword: "penguin" },
      sort: "followers",
      order: "desc",
      page: 2,
      perPage: 5
    });

    expect(spyQuery).toHaveBeenCalledWith({ keyword: "penguin" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.searchParams.get("q")).toBe("penguin");
    expect(url.searchParams.get("sort")).toBe("followers");
    expect(url.searchParams.get("order")).toBe("desc");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("per_page")).toBe("5");
    expect(result.items[0].username).toBe("penguin");
    expect(result.rateLimitRemaining).toBe(59);
  });

  it("omits sponsor:false and type:any from query", async () => {
    const spyQuery = jest.spyOn(builder, "buildSearchQuery");
    const fetchMock = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          total_count: 0,
          incomplete_results: false,
          items: []
        }),
        {
          status: 200,
          headers: new Headers({ "x-ratelimit-remaining": "59" })
        }
      )
    );
    global.fetch = fetchMock as any;

    await searchGitHubUsers({
      filters: {
        keyword: "mj",
        sponsor: false
      }
    });

    expect(spyQuery).toHaveBeenCalledWith({
      keyword: "mj",
      sponsor: false
    });
    const qParam = new URL(fetchMock.mock.calls[0][0] as string).searchParams.get("q")!;
    expect(qParam.includes("sponsor:false")).toBe(false);
  });
});
