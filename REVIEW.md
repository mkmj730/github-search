# 1차 코드 리뷰 (요구사항 대비)

## 주요 이슈
- **Created 필터 미구현**: 검색 DSL 요구사항에 있는 `created` 조건이 UI 상태/요청 경로에 연결되지 않았습니다. `FilterPanel`, `searchSlice`, `SearchResult` 페이로드에 created 입력이 없고 `/api/github/search`로 전달되지 않아 날짜 조건 검색 불가능합니다. (예: apps/web/components/SearchResult.tsx, packages/core/usecases/searchQueryBuilder.ts는 지원하지만 UI가 누락)
- **Org 검색 제한**: API 라우트에서 `q`에 `type:user`를 강제로 덧붙여 `searchGitHubUsers`를 호출하여 조직 검색이 사실상 막힙니다. 요구사항은 사용자/조직 검색인데, 기본이 user-only라 org 검색 실패 가능성이 높습니다. (apps/web/app/api/github/search/route.ts)
- **일부 DSL 필드의 UI 미노출**: DSL에 명시된 `in:name`, `in:email` 토글이 UI/상태에 없습니다. 현재는 키워드에 직접 입력해야 하므로 사용성을 해칩니다. 요구사항상 “계정명, 성명, 메일” 검색을 UI로 지원하는지 확인 필요.
- **Cypress 신뢰성**: E2E가 GitHub 실시간 API에 의존하며 rate-limit이 자주 발생(secondary limit 포함). 목킹이 없어 로컬에서도 테스트가 불안정합니다. Network stubbing 또는 fixture 기반 가짜 API 라우트가 필요합니다. (apps/web/cypress/e2e/search.cy.ts)
- **ASC/DESC 고정 확인**: UI에서 sort 변경 시 `order`가 항상 `"desc"`로 전달되는지 명시적 테스트 부재. 현재 코드상 `order: "desc"`로 고정되어 있지만 회귀 방지를 위한 단위테스트/통합테스트가 없습니다.

## 개선 제안 (우선순위 순)
1. **Created 입력 추가**: FilterPanel/Redux/페치 페이로드에 `created` 문자열 입력(예: `>2020-01-01`)을 연결하고, API body에 포함되도록 수정.
2. **Org 검색 허용**: `route.ts`에서 `type:user` 기본값을 제거하거나 UI에서 user/org 토글을 두고 반영. 기본은 “제한 없음”으로 두고 필요 시 `type:user`/`type:org`를 붙이도록 변경.
3. **Name/Email 범위 토글**: `in:name`, `in:email` 체크박스를 FilterPanel에 추가하고 Query builder 입력에 연결.
4. **E2E 안정화**: `/api/github/search`를 Cypress에서 intercept하여 fixture로 응답하도록 변경, 또는 Next API 라우트에 `MOCK_GITHUB=1` 환경 플래그를 두고 정적 응답을 반환.
5. **Order 고정 테스트**: API 호출 파라미터를 검사하는 단위 테스트(또는 React Testing Library + MSW)로 sort 변경 시 항상 `order: "desc"`가 유지됨을 검증.

## 양호한 점
- Clean architecture 레이어와 DSL 빌더, 레이트 리밋 핸들러, DTO 매퍼에 대한 Jest 테스트가 포함됨.
- MUI 컴포넌트와 Tailwind 레이아웃을 분리 사용했고 다크모드 시스템 연동을 Provider에서 처리.
- WASM 아바타 렌더링 훅이 캔버스에 그리며 Rust 스텁도 제공되어 확장 가능.
