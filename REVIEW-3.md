# 3차 코드 리뷰 (요구사항 대비)

## 검색 기능 구현 상태
- 사용자/조직: `type` 필터(Any/User/Org) → DSL `type:user|org`.
- 계정명/성명/메일: `in:name`, `in:email` 토글 지원.
- 리포지토리/팔로워 수: `repos`, `followers` 범위 비교(>, >= 등).
- 위치/언어: `location`, `language` 입력.
- 계정 생성 시점: `created` 문자열/날짜 입력.
- 후원 가능 여부: `sponsor:true`만 DSL에 포함(불필요한 `false` 제외).
- 정렬: default/followers/repositories/joined + DESC 고정.
- 서버 호출: Next API 라우트에서 `Authorization: token` 사용.

## 구현 조건 점검
- 다크 모드: 시스템 연동 + 토글 (`providers.tsx`).
- 반응형: Tailwind 레이아웃으로 SM/MD/LG/XL 대응.
- MUI 팔레트/컴포넌트 + Tailwind 레이아웃, 폰트 폴백(Apple → Noto).
- 페이징: `/search` SSR 1페이지 + CSR 무한 스크롤(IntersectionObserver, Load more).
- 아바타: Canvas + WASM 훅으로 렌더링.
- 테스트: Jest 단위(DSL, 레이트리밋, 매퍼, pagination 등) + Cypress E2E 스펙.
- 레이트리밋: 1회 재시도 + secondary limit 백오프, 남은 쿼터 UI 경고.
- Mock: `MOCK_GITHUB=1`으로 스텁 응답 가능(레이트리밋 회피).

## 테스트 실행
- 설치/실행: `pnpm install`, `pnpm dev` (또는 `MOCK_GITHUB=1 pnpm dev`).
- 유닛: `pnpm test`.
- E2E: dev 서버 실행 후 `pnpm e2e` (스텁 사용 권장).
- 환경: `.env.local`에 `GITHUB_TOKEN`, 필요 시 `MOCK_GITHUB=1`.
