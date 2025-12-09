# Implementation Specs

- **Monorepo**: TurboRepo + pnpm workspace with `apps/web` and `packages/{core,data,ui,wasm}`.
- **Search DSL**: `packages/core/usecases/searchQueryBuilder.ts` supports user/org, name/email qualifiers, repos/followers ranges, location, language, created date, sponsorable flag. Jest tests included.
- **API Layer**: `packages/data/apiClient.ts` uses GitHub REST Search Users with rate-limit aware fetch (`rateLimitHandler.ts`) and DTO mappers. Jest tests cover mapper and rate-limit retry.
- **UI/State**: Next.js App Router, SSR first page (`app/search/page.tsx`) and CSR infinite scroll (`components/SearchResult.tsx`) using Redux Toolkit slices for search/pagination.
- **Sorting**: followers/repositories/joined/default (DESC enforced at API route).
- **UI Components**: MUI-based SearchBar, FilterPanel, ResultCard (canvas + WASM avatar), SortSelector, DarkModeToggle, InfiniteScrollLoader. Tailwind handles layout.
- **WASM Avatar**: Inline WASM module with Rust stub; hook renders avatars onto canvas.
- **Tests**:
  - Jest: query builder, pagination reducer, rate limit handler, DTO mapper.
  - Cypress: SSR render, infinite scroll, sort change, dark-mode presence.
- **Docs**: README (setup, env, testing, architecture, MUI+Tailwind tips, WASM build, rate-limit), prompts/used_prompts.md, this specs file.
