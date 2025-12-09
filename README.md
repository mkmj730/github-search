# GitHub REST Search Monorepo

과제는 pnpm + turborepo + Next.js 기반으로 구현되었으며,
IDE는 과제 필수 요건이 아닙니다.
AI 기반 생산성을 위해 Cursor/VSCode 환경에서 개발을 진행했습니다.

## 스택
- Next.js 14 (App Router) + TypeScript + ES2023
- Redux Toolkit
- MUI 컴포넌트 + Tailwind 레이아웃 (다크 모드 시스템 연동)
- TurboRepo + pnpm workspace
- Jest + Testing Library + Cypress
- 인라인 WASM 아바타 렌더러 (Rust stub 포함)

## 시작하기
```bash
pnpm install
pnpm dev       # apps/web
pnpm build
pnpm test      # 패키지별 Jest
pnpm e2e       # Cypress (dev 서버 별도 실행, 필요 시 MOCK_GITHUB=1)
```

### 환경변수
`apps/web/.env.local` (또는 루트 `.env`)에 설정:
```
GITHUB_TOKEN=your_personal_access_token
MOCK_GITHUB=1   # 선택, 로컬/E2E에서 레이트리밋 회피용 스텁
```
토큰은 `/api/github/search`에서 `Authorization: token ...`으로 사용됩니다.

## 프로젝트 구조
```
root/
 ├ apps/
 │   └ web/                  # Next.js 앱 (SSR 1페이지, CSR 무한 스크롤)
 ├ packages/
 │   ├ core/                 # DSL 쿼리 빌더
 │   ├ data/                 # GitHub API 클라이언트, DTO/매퍼, 레이트리밋 핸들러
 │   ├ ui/                   # MUI 컴포넌트(Tailwind 친화적 래퍼)
 │   └ wasm/                 # 아바타 렌더러 훅 + Rust 스텁
 ├ prompts/used_prompts.md   # 프롬프트 기록
 ├ specs.md                  # 기능 체크리스트
 ├ turbo.json, pnpm-workspace.yaml, tsconfig.base.json, .eslintrc.json
```

## 아키텍처/기능 요약
- **SSR + CSR**: `/search` 첫 페이지는 SSR. 이후 페이지는 IntersectionObserver 기반 CSR 무한 스크롤, Redux로 상태 관리.
- **검색 DSL**: `packages/core/usecases/searchQueryBuilder.ts`에서 user/org, name/email, repos/followers 범위, location, language, created, sponsorable을 조합.
- **API 라우트**: `app/api/github/search/route.ts`가 GitHub Search Users 호출(DESC), 레이트리밋 처리, 남은 쿼터 반환.
- **상태 관리**: 검색 필터/정렬 + 페이지네이션 슬라이스, 로딩/에러/hasMore 플래그.
- **UI**: MUI 위젯 + Tailwind 레이아웃. 다크 모드는 시스템/토글 연동. Rate limit 인디케이터, 정렬/결과 헤더, 반응형 그리드.
- **아바타 WASM**: `packages/wasm/avatar_renderer/hook.ts`에서 인라인 WASM으로 Canvas 렌더; `lib.rs`로 빌드 확장 가능.
- **Mock 지원**: `MOCK_GITHUB=1` 시 API 라우트가 스텁 응답 반환(Cypress/로컬 테스트 용이).

## MUI + Tailwind 병행 시 주의사항
- 레이아웃은 Tailwind(flex/grid/spacing/breakpoint), 컴포넌트는 MUI로 사용.
- `sx` 대신 가능한 `className` 래퍼를 활용해 Tailwind와 충돌 방지.
- 다크 모드: Providers에서 `dark` 클래스 토글, MUI 테마 동기화.
- 날짜 입력 등 라벨 겹침 방지: `InputLabelProps.shrink` 활용.

## WASM 빌드
- 기본은 인라인 WASM 사용. 실 빌드가 필요하면 `packages/wasm/avatar_renderer`에서:
  ```bash
  wasm-pack build --target web --out-dir pkg
  ```
  후크에서 빌드된 바이너리를 로드하도록 수정.

## 테스트
- **Jest**: `pnpm test` (DSL 빌더, 레이트리밋 핸들러, 매퍼, 페이지네이션 리듀서, API client URL 조합 등).
- **Cypress**: `pnpm e2e` (dev 서버 실행 상태). SSR 렌더, 무한 스크롤, 정렬, 다크 모드 연동 검증. 레이트리밋 회피를 위해 `MOCK_GITHUB=1` 권장.

## Rate Limit 핸들링
- `fetchWithRateLimit`가 `x-ratelimit-remaining=0` 시 한 번 재시도, secondary rate limit는 `retry-after`/메시지 기반 대기 후 재시도. 남은 쿼터는 UI에 경고로 표시.

## 스펙 요약
- Next.js App Router + TS + Redux Toolkit, SSR 1페이지 + CSR 무한 스크롤.
- 필터: user/org, name/email 토글, repos/followers 범위, location, language, created, sponsor(true만).
- 정렬: default/followers/repositories/joined, order desc 고정.
- GitHub API는 서버 라우트에서 token 사용, 레이트리밋 재시도/백오프, mock 지원.
- UI: MUI 컴포넌트 + Tailwind 레이아웃; Canvas+WASM 아바타; 반응형 SM/MD/LG/XL.
