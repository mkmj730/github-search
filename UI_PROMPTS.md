# GitHub User Search Service - Used UI Prompts

You are a senior front-end engineer and product designer.
Stack: Next.js App Router + TypeScript + MUI + Tailwind CSS.

================================================================================
GLOBAL UI SYSTEM PROMPT
================================================================================

Global UI Requirements:
- System dark mode support (prefers-color-scheme)
- Fully responsive: SM / MD / LG / XL
- Material Design color palette
- Font fallback: Apple system font → Noto Sans
- MUI handles UI components
- Tailwind handles ONLY layout and spacing
- No inline styles
- Production-grade, accessible UI (WCAG AA)

Design Direction:
- Clean developer-tool aesthetic
- GitHub-like neutral monochrome base
- High contrast for data-heavy UI
- Minimal motion, fast-feel UX
- Dashboard-style layout

Layout Rules (Strict):
- Use Tailwind ONLY for: grid, flex, spacing, width, breakpoints
- Use MUI ONLY for: inputs, selects, buttons, chips, cards, dialog
- Do NOT use Tailwind utilities inside MUI `sx`
- Do NOT use MUI spacing system for layout

Accessibility:
- All inputs must have visible labels
- Focus ring must be clearly visible
- Full keyboard navigation required

Output Rules:
- React + TypeScript (TSX) only
- No explanation
- Production-ready code only

================================================================================
SEARCH FILTER PANEL UI PROMPT
================================================================================

Build a GitHub User Search Filter Panel UI.

Functional Requirements:
- Toggle: User / Organization
- Search by: username, full name, email
- Repository count range (min / max)
- Location
- Programming language
- Account creation date range
- Follower count range (min / max)
- Sponsor availability toggle
- Sort by: default, followers, repositories, joined
- Sort order: DESC only

UI Structure:
- Desktop: left fixed sidebar filter panel
- Mobile: bottom-sheet filter panel
- Sticky apply/reset button on mobile

Design:
- MUI Outlined Input, Select, Checkbox, Switch
- Tailwind grid & spacing only
- GitHub-like grayscale tone
- Clear visual grouping per filter section
- Active filter count badge

Dark Mode:
- Background: neutral-900
- Card / Panel: neutral-800
- Divider: neutral-700
- Text primary: neutral-50

UX Rules:
- Rarely used filters collapsed by default
- Apply button is visually primary
- Reset button is visually secondary

================================================================================
SEARCH RESULT LIST UI PROMPT
================================================================================

Build a GitHub User Search Result List UI.

Functional:
- Avatar rendered using Canvas placeholder
- Display: username, full name, bio
- Follower count
- Repository count
- Location
- Sponsor badge
- Infinite scroll after first SSR page

Layout:
- XL: grid layout
- MD and below: list layout
- Avatar left, info right
- Visual hierarchy:
  username > followers > repositories > bio

Design:
- MUI Card per user
- Tailwind grid, gap, max-width
- Skeleton loading on CSR fetch
- Subtle hover elevation effect

Dark Mode:
- Card background adapts to theme
- Hover elevation brighter in dark mode

Performance UX:
- No layout shift on image loading
- Fixed avatar width with aspect-square

================================================================================
SSR + CSR INFINITE SCROLL UX PROMPT
================================================================================

Design UX for SSR first page + CSR infinite scroll.

Rules:
- First result page rendered with SSR
- Subsequent pages fetched with CSR via IntersectionObserver
- Top loading progress bar during API fetch
- Footer loading spinner during infinite scroll
- Preserve scroll position on filter change

UX Safety:
- Prevent duplicate fetch
- Disable filter UI during request
- Always show GitHub API rate limit remaining

Visuals:
- MUI LinearProgress for top loading indicator
- Tailwind fixed footer loader area

================================================================================
GITHUB RATE LIMIT & RETRY STATUS UI PROMPT
================================================================================

Build GitHub API Rate Limit & Retry Status UI.

Features:
- Remaining API quota
- Reset time display
- Retry countdown when blocked
- Automatic retry state visualization

UI:
- Fixed bottom-right floating indicator
- MUI Chip + Tooltip
- Tailwind fixed positioning

States:
- Normal
- Warning (below 20%)
- Blocked (limit exceeded)

================================================================================
TEST-FRIENDLY UI SELECTOR PROMPT (CYPRESS / JEST)
================================================================================

All critical UI elements must include stable testing selectors:

Required data-testid:
- search-input
- filter-apply-button
- filter-reset-button
- sort-selector
- infinite-scroll-trigger
- rate-limit-indicator

Do not rely on random class names or MUI-generated IDs for testing.

================================================================================
END OF USED UI PROMPTS
================================================================================
