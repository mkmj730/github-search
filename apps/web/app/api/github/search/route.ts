import { NextResponse } from "next/server";
import { searchGitHubUsers } from "@data/apiClient";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const { q, sort, page } = body as {
    q: string;
    sort?: "followers" | "repositories" | "joined";
    page?: number;
  };

  if (process.env.MOCK_GITHUB === "1") {
    console.info("[API/github/search] MOCK_GITHUB enabled, returning stub data");
    return NextResponse.json({
      totalCount: 1,
      items: [
        {
          username: "mock-user",
          id: 1,
          avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
          profileUrl: "https://github.com/mock-user",
          type: "User",
          score: 99
        }
      ],
      rateLimitRemaining: 999
    });
  }

  try {
    console.info("[API/github/search] incoming", { q, sort, page });
    const result = await searchGitHubUsers({
      filters: { keyword: q },
      sort,
      order: "desc",
      page
    });
    console.info("[API/github/search] outgoing", {
      items: result.items.length,
      totalCount: result.totalCount,
      rateLimitRemaining: result.rateLimitRemaining
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API/github/search] error", error?.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
