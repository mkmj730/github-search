# 2차 코드 리뷰 (요구사항 대비)

## 1. 구현해야 할 검색 기능
- **완료**: 사용자/조직 검색(type 선택), name/email 범위(in:name/in:email), repos/followers 수치 필터, location, language, created 날짜 조건, sponsorable 여부, 정렬 followers/repositories/joined/default(항상 DESC).
- **개선 필요 없음**: DSL 빌더와 API 라우트가 동일 스펙을 수용하며, UI 입력 → QueryBuilder → API까지 전달 경로가 연결됨.

## 2. 구현 조건 및 UX 체크
- **UI 입력 반영**: FilterPanel에 created, in:name/email, type(any/user/org) 추가 완료. 기본 in:name=true로 검색 정확도 확보.
- **Org 검색 허용**: API 라우트에서 `type:user` 강제 제거. UI type 필드로 제어.
- **Rate Limit/Mock**: `MOCK_GITHUB=1` 시 API 라우트가 스텁 데이터 반환 → Cypress/로컬에서 GitHub 호출 회피 가능. `fetchWithRateLimit`가 1) 기본 rate limit, 2) secondary limit(retry-after/message) 둘 다 대기 후 재시도.
- **SSR/CSR**: `/search`는 SSR 초기 호출 후 CSR 무한 스크롤 유지.
- **UX 제안(선택)**: created/type 입력에 헬퍼 텍스트 추가, RateLimit 경고에 “재시도” 버튼 또는 자동 재시도 진행 중 표시 추가.

## 3. 테스트 실행
- **Jest 단위**: `pnpm test` (root). 추가된 secondary rate-limit 백오프 케이스 포함 (`packages/data/rateLimitHandler.test.ts`).
- **Cypress E2E**: `MOCK_GITHUB=1 pnpm dev` 후 별 터미널에서 `pnpm e2e` 실행 시 GitHub API 무의존 검증 가능. (실 API 사용 시 토큰 필수, rate-limit 가능성 있음)
- **추천 추가 테스트(향후)**:
  - `SearchResult` 렌더 테스트(MSW로 `/api/github/search` mock) → created/type/in:name/email 반영 확인.
  - API 라우트 단위 테스트로 정렬 시 항상 `order=desc`인지 검증.
