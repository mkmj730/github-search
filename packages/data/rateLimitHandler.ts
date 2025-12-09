const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface RateLimitInfo {
  remaining: number;
  reset?: number;
}

export interface Fetcher {
  (input: string, init?: RequestInit): Promise<Response>;
}

/**
 * Wraps fetch to retry once when GitHub rate limits, including secondary rate limits.
 */
export const fetchWithRateLimit = async (
  fetcher: Fetcher,
  input: string,
  init?: RequestInit
): Promise<{ response: Response; rateLimit: RateLimitInfo }> => {
  let response = await fetcher(input, init);

  if (response.status === 403) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = Number(response.headers.get("x-ratelimit-reset") || 0) * 1000;
    const retryAfter = Number(response.headers.get("retry-after") || 0) * 1000;
    let waitMs = 0;

    if (remaining === "0") {
      waitMs = Math.max(reset - Date.now(), 1000);
    } else {
      try {
        const body = await response.clone().json();
        if (typeof body?.message === "string" && body.message.toLowerCase().includes("secondary rate limit")) {
          waitMs = retryAfter || 60_000;
        }
      } catch {
        // ignore parse errors, fall through
      }
    }

    if (waitMs > 0) {
      await delay(waitMs);
      response = await fetcher(input, init);
    }
  }

  const rateLimit: RateLimitInfo = {
    remaining: Number(response.headers.get("x-ratelimit-remaining") || -1),
    reset: response.headers.get("x-ratelimit-reset")
      ? Number(response.headers.get("x-ratelimit-reset"))
      : undefined
  };

  return { response, rateLimit };
};
