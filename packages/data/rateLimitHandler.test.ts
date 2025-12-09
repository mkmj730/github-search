import { fetchWithRateLimit } from "./rateLimitHandler";

const makeResponse = (status: number, remaining: string, reset?: number) =>
  new Response("{}", {
    status,
    headers: new Headers({
      "x-ratelimit-remaining": remaining,
      ...(reset ? { "x-ratelimit-reset": String(reset) } : {})
    })
  });

describe("fetchWithRateLimit", () => {
  it("retries once when rate limited", async () => {
    const reset = Math.floor(Date.now() / 1000) + 1;
    const fetcher = jest
      .fn()
      .mockResolvedValueOnce(makeResponse(403, "0", reset))
      .mockResolvedValueOnce(makeResponse(200, "59"));

    const result = await fetchWithRateLimit(fetcher as any, "https://api.github.com");
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(result.rateLimit.remaining).toBe(59);
  });

  it("returns remaining without retry when not rate limited", async () => {
    const fetcher = jest.fn().mockResolvedValue(makeResponse(200, "10"));
    const result = await fetchWithRateLimit(fetcher as any, "https://api.github.com");
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result.rateLimit.remaining).toBe(10);
  });

  it("backs off on secondary rate limit with retry-after", async () => {
    jest.useFakeTimers();
    const now = Math.floor(Date.now() / 1000);
    const fetcher = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "You have exceeded a secondary rate limit." }), {
          status: 403,
          headers: new Headers({
            "retry-after": "1",
            "x-ratelimit-remaining": "5"
          })
        })
      )
      .mockResolvedValueOnce(
        new Response("{}", {
          status: 200,
          headers: new Headers({
            "x-ratelimit-remaining": "4",
            "x-ratelimit-reset": String(now + 60)
          })
        })
      );

    const promise = fetchWithRateLimit(fetcher as any, "https://api.github.com");
    await jest.runAllTimersAsync();
    const result = await promise;
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(result.rateLimit.remaining).toBe(4);
    jest.useRealTimers();
  });
});
