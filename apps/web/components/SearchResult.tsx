"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchBar, FilterPanel, SortSelector, ResultCard, InfiniteScrollLoader } from "@ui/index";
import { GitHubAccount } from "@data/mapper/githubUserMapper";
import { FilterState } from "@ui/FilterPanel";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { setFilters, setKeyword, setSort } from "../lib/searchSlice";
import { nextPage, resetPagination, setError, setHasMore, setStatus } from "../lib/paginationSlice";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { buildSearchQuery } from "@core/usecases/searchQueryBuilder";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import { useStore } from "react-redux";
import SortIcon from "@mui/icons-material/Sort";
import Typography from "@mui/material/Typography";

interface Props {
  initialResult: { items: GitHubAccount[]; totalCount: number; rateLimitRemaining: number };
  initialFilters: FilterState & { keyword: string };
}

const parseRange = (raw: string) => {
  if (!raw) return undefined;
  const match = raw.match(/(>=|<=|>|<|=)?\s*(\d+)/);
  if (!match) return undefined;
  const op = match[1] ?? "=";
  const value = Number(match[2]);
  if (op === "=") return value;
  return { operator: op as ">" | ">=" | "<" | "<=" | "=", value };
};

const SearchResult: React.FC<Props> = ({ initialResult, initialFilters }) => {
  const dispatch = useAppDispatch();
  const searchState = useAppSelector((s) => s.search);
  const pagination = useAppSelector((s) => s.pagination);
  const store = useStore();
  const [items, setItems] = useState<GitHubAccount[]>(initialResult.items);
  const [rateLimit, setRateLimit] = useState(initialResult.rateLimitRemaining);
  const [totalCount, setTotalCount] = useState(initialResult.totalCount);
  const [hasSearched, setHasSearched] = useState(initialResult.items.length > 0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(setKeyword(initialFilters.keyword));
    dispatch(
      setFilters({
        location: initialFilters.location,
        language: initialFilters.language,
        repos: initialFilters.repos,
        followers: initialFilters.followers,
        sponsor: initialFilters.sponsor,
        created: initialFilters.created,
        inName: initialFilters.inName,
        inEmail: initialFilters.inEmail,
        type: initialFilters.type
      })
    );
  }, [dispatch, initialFilters]);

  const buildPayload = useCallback(
    (page: number, state = searchState) => {
      const filters = state.filters;
      const query = buildSearchQuery({
        keyword: state.keyword,
        type: filters.type !== "any" ? filters.type : undefined,
        inName: filters.inName,
        inEmail: filters.inEmail,
        location: filters.location,
        language: filters.language,
        repos: parseRange(filters.repos),
        followers: parseRange(filters.followers),
        created: filters.created || undefined,
        sponsor: filters.sponsor
      });

      return {
        q: query,
        sort: state.sort !== "default" ? state.sort : undefined,
        order: "desc" as const,
        page
      };
    },
    [searchState]
  );

  const fetchPage = useCallback(
    async (page: number, state = searchState) => {
      dispatch(setStatus("loading"));
      const payload = buildPayload(page, state);
      if (!payload.q.trim()) {
        dispatch(setError("Please enter a search term."));
        dispatch(setHasMore(false));
        dispatch(setStatus("idle"));
        return;
      }
      try {
        const res = await fetch("/api/github/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        const data = await res.json();
        const newItems: GitHubAccount[] = data.items ?? [];
        setItems((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
        setRateLimit(data.rateLimitRemaining ?? 0);
        setTotalCount(data.totalCount ?? 0);
        dispatch(setHasMore(newItems.length > 0));
        dispatch(setError(undefined));
      } catch (err: any) {
        dispatch(setError(err.message));
        dispatch(setHasMore(false));
      } finally {
        dispatch(setStatus("idle"));
      }
    },
    [buildPayload, dispatch, searchState]
  );

  const handleSearch = useCallback(() => {
    const currentSearch = (store.getState() as any).search as typeof searchState;
    setItems([]);
    dispatch(resetPagination());
    dispatch(setHasMore(true));
    dispatch(setError(undefined));
    setHasSearched(true);
    fetchPage(1, currentSearch);
  }, [dispatch, fetchPage, store]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          pagination.status === "idle" &&
          pagination.hasMore &&
          hasSearched
        ) {
          dispatch(nextPage());
        }
      },
      { threshold: 1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [dispatch, pagination.hasMore, pagination.status, hasSearched]);

  useEffect(() => {
    if (pagination.page > 1) {
      fetchPage(pagination.page);
    }
  }, [fetchPage, pagination.page]);

  useEffect(() => {
    setItems(initialResult.items);
  }, [initialResult.items]);

  const filters = useMemo(
    () => ({
      location: searchState.filters.location,
      language: searchState.filters.language,
      repos: searchState.filters.repos,
      followers: searchState.filters.followers,
      sponsor: searchState.filters.sponsor,
      created: searchState.filters.created,
      inName: searchState.filters.inName,
      inEmail: searchState.filters.inEmail,
      type: searchState.filters.type
    }),
    [searchState.filters]
  );

  return (
    <section className="space-y-6">
      {pagination.status === "loading" && <LinearProgress />}
      <Paper elevation={3} className="sticky top-0 z-30 p-4 space-y-3 backdrop-blur-md" square={false}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchState.keyword}
              onChange={(v: string) => dispatch(setKeyword(v))}
              onSubmit={handleSearch}
              placeholder="Search by user, org, name, email"
              data-testid="search-input"
            />
          </div>
        </div>
      </Paper>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] items-start">
        <div className="space-y-4">
          <FilterPanel
            value={filters}
            onChange={(v) => dispatch(setFilters(v))}
            onApply={handleSearch}
            onReset={() => {
              dispatch(resetPagination());
              dispatch(
                setFilters({
                  location: "",
                  language: "",
                  repos: "",
                  followers: "",
                  sponsor: false,
                  created: "",
                  inName: true,
                  inEmail: false,
                  type: "any"
                })
              );
              fetchPage(1, {
                ...searchState,
                filters: {
                  location: "",
                  language: "",
                  repos: "",
                  followers: "",
                  sponsor: false,
                  created: "",
                  inName: true,
                  inEmail: false,
                  type: "any"
                }
              });
            }}
            disabled={pagination.status === "loading"}
            activeCount={Object.values(filters).filter((v) => v && v !== "any").length}
          />
          <Paper className="space-y-2 p-3" variant="outlined">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Overview</span>
              <Chip size="small" label={`${totalCount} results`} />
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">
              Followers/Repos filters help refine candidates. Apply filters to refresh results.
            </div>
          </Paper>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Typography variant="subtitle1" className="font-semibold">
                Results
              </Typography>
              <Chip size="small" label={totalCount} />
            </div>
            <div className="flex items-center gap-2">
              <SortIcon fontSize="small" />
              <div data-testid="sort-selector" className="min-w-[180px]">
                <SortSelector
                  value={searchState.sort}
                  onChange={(v) => {
                    dispatch(setSort(v));
                    dispatch(resetPagination());
                    fetchPage(1, { ...searchState, sort: v });
                  }}
                />
              </div>
            </div>
          </div>
          <Stack spacing={2}>
            {pagination.status === "loading" && <Alert severity="info">Loading...</Alert>}
            {pagination.error && <Alert severity="error">{pagination.error}</Alert>}
            {rateLimit <= 5 && (
              <Alert severity="warning">GitHub rate limit is low: {rateLimit} remaining</Alert>
            )}
          </Stack>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item) => (
              <div data-testid="result-card" key={item.id}>
                <ResultCard user={item} />
              </div>
            ))}
          </div>

          {items.length === 0 && pagination.status === "idle" && <Alert severity="info">No results</Alert>}

          {pagination.status === "loading" && <InfiniteScrollLoader />}

          <div ref={sentinelRef} data-testid="infinite-scroll-trigger" />
          <div className="flex justify-center">
            <Button variant="outlined" onClick={() => fetchPage(pagination.page + 1)}>
              Load more
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4" data-testid="rate-limit-indicator">
        <Tooltip title={`Remaining: ${rateLimit}${rateLimit <= 5 ? " (low)" : ""}`} placement="left">
          <Chip color={rateLimit <= 5 ? "warning" : "default"} label={`Rate limit: ${rateLimit}`} variant="filled" />
        </Tooltip>
      </div>
    </section>
  );
};

export default SearchResult;
