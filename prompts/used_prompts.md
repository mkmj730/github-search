# Used Prompts

```markdown
# =====================================================

# 🚀 **[MASTER PROMPT – Hiring Assignment 자동 생성]**

# =====================================================

## 📌 **목표**

GitHub REST API 기반 사용자 검색 서비스 과제를 아래 요구사항을 100% 충족한 상태로 자동 구현한다.

---

# 1) 🏗️ **프로젝트 전체 구조 생성**

다음 조건을 충족하는 **TurboRepo 기반 pnpm Workspace**를 생성한다.

## ✔️ Monorepo 구조

```
root/
 ├ apps/
 │   └ web/                   # Next.js 14(App Router) 메인 애플리케이션
 ├ packages/
 │   ├ core/                  # domain, entities, usecases (Clean Architecture 핵심)
 │   ├ data/                  # GitHub API client, DTO, mapper, rate limit handler
 │   ├ ui/                    # MUI + Tailwind 기반 공통 UI 컴포넌트
 │   └ wasm/                  # HTML5 Canvas + WASM 기반 Avatar 렌더러
 ├ prompts/
 │   └ used_prompts.md        # 모든 AI 프롬프트 기록
 ├ README.md
 ├ turbo.json
 ├ package.json
 ├ pnpm-workspace.yaml
 └ .eslintrc.json
```

### ✔️ 기술 스택 요구사항

* Next.js 14 (App Router)
* TypeScript + ES2023
* pnpm + turbo
* Redux Toolkit
* MUI (Material UI)
* Tailwind CSS
* Jest + Testing Library
* Cypress
* WASM(AssemblyScript 또는 Rust 중 선택)
* ESLint + Prettier

### ✔️ UI 규칙

* **컴포넌트 = MUI**
* **레이아웃 = Tailwind**
* 다크 모드 = 시스템 연동
* 폰트 fallback: Apple → Noto

---

# 2) 🔌 **GitHub REST API 서버 라우트 구현**

Next.js App Router의 `/app/api/github/search/route.ts`에서 아래 요구사항을 만족하는 API 구현:

### 요청 규칙:

* Authorization: token {env.GITHUB_TOKEN}
* GitHub REST API Search Users 사용
  [https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-users](https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-users)

### 기능:

* 사용자/조직만 검색
* 계정명, 성명, 메일로 검색
* repo count 조건 검색
* location 검색
* language 검색
* created date 조건 검색
* follower 수 검색
* 후원 가능 여부(sponsorable) 검색
* 정렬 sorting: default / followers / repositories / joined
* DESC order 강제
* Rate limit 초과 시 자동 재시도 + 남은 쿼터 표시

### 출력:

* data/

  * dto/
  * mapper/
  * apiClient.ts
  * rateLimitHandler.ts

---

# 3) 🔎 **검색 DSL(Query Builder) 구현**

다음 조건을 모두 만족하는 검색 쿼리 조합기를 `packages/core/usecases/searchQueryBuilder.ts`에 구현한다:

### DSL 요구사항

```
user:{value}
org:{value}
in:name
in:email
repos:>10
followers:>=100
location:"Seoul"
language:TypeScript
created:>2020-01-01
sponsor:true
```

출력:

* 완전한 TypeScript 코드
* Jest 테스트 코드 포함

---

# 4) 🌐 **SSR + CSR 혼합 페이징 구현**

PDF 요구사항을 따라 구현:

### SSR

`app/search/page.tsx`

* 첫 페이지는 서버 컴포넌트에서 GitHub 검색 SSR
* 초기 결과를 hydration-ready 상태로 내려준다
* 다크모드 반영된 UI 선렌더링

### CSR (무한 스크롤)

`SearchResult.tsx` (client component)

* IntersectionObserver 기반 infinite scroll
* Redux Toolkit으로 페이지 · 검색 조건 상태 유지
* 이후 페이지는 CSR fetch

### 정렬 기능

* followers
* repositories
* joined
* 기본(default)
* DESC 고정

### 데이터 안정성 처리

* loading, empty, error UI 구성(MUI)
* GitHub rate limit에 따른 경고 표시

---

# 5) 🎨 **UI 설계 (MUI + Tailwind)**

UI 컴포넌트는 MUI를 사용하고, 레이아웃은 Tailwind로 작성한다.

필수 컴포넌트:

* SearchBar
* FilterPanel
* ResultCard (WASM Avatar 포함)
* SortSelector
* DarkModeToggle
* InfiniteScrollLoader

MUI + Tailwind 병행 시 주의점은 README와 specs.md에 반드시 포함.

---

# 6) 🖼️ **Avatar Canvas + WASM 렌더링 기능**

GitHub avatar URL을 Canvas로 렌더링하되, 반드시 WASM을 사용한다.

구성 요소:

```
packages/wasm/
 └ avatar_renderer/
     ├ lib.rs (또는 index.ts for AssemblyScript)
     ├ build script
```

Next.js 클라이언트에서는:

* `useWasmAvatarRenderer()` 훅 제공
* HTMLCanvasElement에 drawImage 수행

---

# 7) 🧪 **테스트 코드(Jest + Cypress)**

## Jest Unit Tests (필수)

* searchQueryBuilder
* pagination reducer
* rate limit handler
* dto mapper

## Cypress E2E Tests (필수)

* SSR 초기 검색 결과 정상 노출
* 스크롤 시 다음 페이지 정상 로딩
* 정렬 옵션 변경 시 UI 업데이트
* Dark mode 시스템 연동 동작

---

# 8) 📄 **문서 자동 생성**

Codex는 다음 문서를 자동 생성한다.

### README.md

* 실행 방법
* 환경변수(.env)
* 테스트 수행 방법(Jest/Cypress)
* 프로젝트 구조
* 아키텍처 설명
* MUI + Tailwind 병행 시 주의사항
* WASM 빌드 방법
* Rate limit 핸들링 설명

### specs.md

* 구현 스펙 정리
* 기능별 테스트 요구사항 충족 항목 표시

### prompts/used_prompts.md

* Codex에서 사용한 모든 프롬프트 기록 자동 정리

---

# 9) ⚙️ **IDE 규정 처리**

README에 아래 내용을 포함한다:

```
과제는 pnpm + turborepo + Next.js 기반으로 구현되었으며,
IDE는 과제 필수 요건이 아닙니다. 
AI 기반 생산성을 위해 Cursor/VSCode 환경에서 개발을 진행했습니다.
```

---

# 10) 🎯 **최종 출력 요청**

Codex는 위 모든 요구사항을 만족하는 상태로:

1. 전체 monorepo 생성
2. 모든 패키지에 실제 코드 생성
3. SSR/CSR 혼합 페이지 완성
4. Redux + MUI + Tailwind 완성
5. WASM Avatar 렌더링 기능 완성
6. Jest + Cypress 테스트 포함
7. README + specs + used_prompts.md 생성
8. zip 템플릿까지 출력

**→ “완전 실행 가능한 프로젝트 전체 코드”를 출력한다.**

---

# =====================================================

# 🏁 **END OF MASTER PROMPT**

# =====================================================
```
```

## Additional Prompts (Debugging / UI / Flow)

- UI/UX 개선: Naver Search Fluid/Cue: 참고, 필터/결과 레이아웃 재배치, Sticky 검색바, Sort 위치 이동, Responsive SM/MD/LG/XL, 다크모드 색상 보정.
- 홈 리디자인: Google 스타일 히어로, GitHub 검색 로고/검색바, 메인 검색 → `/search?q=` 연동.
- 다크모드/테마: Tailwind `dark` 클래스 토글, MUI 테마 동기화.
- ESM/인코딩/테스트: node-fetch ESM import, WASM 바이너리 섹션 오류, UTF-8 스트림 오류(SearchResult 재작성), Jest 경로/타입(tsconfig react/react-dom) 수정.
- 상태/흐름: 검색 자동 호출 방지, 빈 검색 가드, store 스냅샷으로 최신 상태 fetch, 리스트 초기화 후 fetch, 무한스크롤 안전.
