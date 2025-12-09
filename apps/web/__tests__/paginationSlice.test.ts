import reducer, { resetPagination, nextPage, setStatus, setError, setHasMore } from "../lib/paginationSlice";

describe("paginationSlice", () => {
  it("resets to initial state", () => {
    const state = reducer(
      { page: 3, status: "loading", hasMore: false, error: "oops" },
      resetPagination()
    );
    expect(state).toEqual({ page: 1, status: "idle", hasMore: true, error: undefined });
  });

  it("increments page", () => {
    const state = reducer(undefined, nextPage());
    expect(state.page).toBe(2);
  });

  it("updates status and error", () => {
    let state = reducer(undefined, setStatus("loading"));
    expect(state.status).toBe("loading");
    state = reducer(state, setError("fail"));
    expect(state.status).toBe("error");
    expect(state.error).toBe("fail");
  });

  it("sets hasMore", () => {
    const state = reducer(undefined, setHasMore(false));
    expect(state.hasMore).toBe(false);
  });
});
