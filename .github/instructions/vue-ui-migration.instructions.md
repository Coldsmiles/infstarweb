---
description: "Use when migrating old-html-ver pages into Vue for the bailuyuan website while preserving exact legacy layout, behavior, copy, deep-link behavior, and metadata. Covers removing the temporary review page and demo data, then rebuilding each legacy page 1:1 in Vue."
name: "Vue Legacy Page Parity Migration"
applyTo: "src/**/*.vue, src/**/*.js, src/**/*.css, vite.config.js, package.json, index.html"
---
# Bailuyuan Vue Legacy Page Parity Migration

## Goal

- Replace the temporary Vue component review shell with the real site.
- Migrate every page under `old-html-ver/` to Vue.
- Preserve the legacy site's layout, design, copy, interaction details, responsive behavior, and externally visible navigation behavior.
- Keep the data contracts in `public/data/` and `public/stats/` intact unless a task explicitly says otherwise.

## Non-Negotiable Rules

- Migrate with exact page parity. Do not redesign, modernize, normalize, simplify, or reinterpret the old site on your own.
- Do not keep the site as a temporary single-page component review shell. A real SPA is allowed, but it must preserve user-visible page behavior and must not remove deep-linking and direct access semantics from the legacy site.
- Do not keep `src/App.vue` as a component gallery or leave `src/demoData.js` in the real page flow.
- Do not replace production-like data with mock cards, placeholder lists, or hand-written demo objects once a page is being migrated.
- Do not silently change legacy copy, labels, icon meaning, filter order, badge meaning, modal sections, CTA wording, or page information architecture.
- Do not drop SEO metadata, structured data, verification tags, canonical URLs, or iframe targets from legacy pages unless explicitly requested.
- Do not introduce external UI kits such as Element Plus, Vuetify, Naive UI, or Ant Design Vue.

## Current Vue Baseline

- `src/App.vue` is currently a temporary review page for shared components. It is not a valid final page and must be removed or replaced as part of real migration work.
- `src/demoData.js` is temporary inspection data. It is useful only for base component review and must not remain as the source for migrated pages.
- `src/components/` already contains reusable layout, base, shared, and detail components. Reuse them only when they can reproduce the legacy page without changing the output.
- `vite.config.js` currently has only the default single-entry setup. Future migration work may keep a single-entry SPA or use multiple entries, but the final app must reproduce legacy navigation and direct-entry behavior instead of one showcase page.

## Source Of Truth

- Shared layout and global visual system:
  - `old-html-ver/js/components.js`
  - `old-html-ver/css/style.css`
- Page-specific HTML structure and page head metadata:
  - `old-html-ver/*.html`
- Page-specific interactions:
  - `old-html-ver/js/*.js`
- Page-specific styles:
  - `old-html-ver/css/pages/*.css`
- Runtime data contracts:
  - `public/data/*.json`
  - `public/data/*.txt`
  - `public/stats/summary.json`
  - `public/stats/*.json`

## Shared Legacy Primitives To Preserve

- Navbar, mobile menu, and footer come from `old-html-ver/js/components.js`.
- The reusable page hero pattern comes from `old-html-ver/js/components.js` plus `old-html-ver/css/style.css`.
- The translucent fixed top navigation, 44px header offset, rounded cards, soft shadows, and hero overlays come from `old-html-ver/css/style.css`.
- Shared sponsor parsing logic comes from `old-html-ver/js/data_utils.js` and the `data/sponsors.txt` format.

## URL And Architecture Rules

- A SPA architecture is allowed.
- Multiple page entries are also allowed.
- Choose the architecture that best preserves exact legacy behavior under static hosting.
- Direct access must still work for every migrated legacy page state that users can reasonably share or bookmark.
- For announcements, facilities, and towns, deep links must open the correct page and automatically expand or open the corresponding detail item or modal.
- It is acceptable to replace legacy `.html` paths with SPA routes only if external navigation remains stable enough for users and existing shared links continue to work or are intentionally redirected.
- If `vite.config.js` changes, keep deployment and static asset loading compatible with GitHub Pages style hosting.
- Keep relative fetch paths and static hosting compatibility.

## Reuse Policy For Existing Vue Components

- `SiteNavbar`, `MobileNavDrawer`, `PageHero`, and `SiteFooter` should be aligned to the legacy navbar, mobile menu, hero, and footer behavior from `old-html-ver/js/components.js`.
- `SearchBox`, `FilterTagGroup`, `FilterPanel`, `BaseModal`, `LoadMoreButton`, and related shared components are allowed starting points, but only if the migrated page still matches the legacy page exactly.
- `FeatureBentoGrid`, `JoinWizard`, `FacilityCard`, `TownCard`, `AnnouncementTimeline`, `LeaderboardCard`, `PlayerCard`, `DonationCard`, and detail modals are starting points, not final truth. Adjust them to the old page instead of adjusting the old page to the component.
- If a legacy page needs markup or behavior that existing components cannot express exactly, change the shared component or add a page-specific wrapper instead of forcing a mismatch.

## Page Inventory And Migration Notes

### Home Page

- Source files:
  - `old-html-ver/index.html`
  - `old-html-ver/js/script.js`
  - `old-html-ver/js/data_utils.js`
  - `old-html-ver/css/style.css`
- Must preserve:
  - skip link to main content
  - full head metadata and structured data
  - hero background, overlay, and title layout
  - rotating subtitle words with the same cadence
  - runtime timer from `2021-09-14T09:57:59`
  - copy-to-clipboard server IP box and tooltip behavior
  - live server status from `https://api.mcstatus.io/v2/status/java/mcpure.lunadeer.cn`
  - online player tooltip list and offline fallback states
  - bento feature grid with the same card count and hierarchy
  - top sponsor section built from `data/sponsors.txt`
  - crowdfunding section built from `data/fund_progress.txt`
- Migration notes:
  - do not replace live status or counters with static placeholders
  - keep the hidden crowdfunding section behavior that only shows when valid data exists

### Announcements Page

- Source files:
  - `old-html-ver/announcements.html`
  - `old-html-ver/js/announcements_script.js`
  - `old-html-ver/css/pages/announcements.css`
- Data source:
  - `public/data/announcements.json`
- Must preserve:
  - page hero content and layout
  - search input behavior
  - category filter buttons and active states
  - timeline layout and category-specific styling
  - first card expanded by default
  - click-to-expand with only one expanded card at a time
  - direct link behavior that opens the matching item automatically
  - share button that copies the deep link
  - hidden edit mode triggered by typing `edit`
  - rich content block rendering for text, image, and Bilibili video items
- Migration notes:
  - keep the secret keyboard shortcut and console hint unless explicitly removed
  - keep stable deep-link id generation semantics, whether implemented with hash or router state

### Facilities Page

- Source files:
  - `old-html-ver/facilities.html`
  - `old-html-ver/js/facilities_script.js`
  - `old-html-ver/css/pages/facilities.css`
- Data source:
  - `public/data/facilities.json`
- Must preserve:
  - search input
  - independent type and dimension filters
  - facility card layout and status indicator styles
  - detail modal content sections
  - map link format to `https://mcmap.lunadeer.cn/`
  - contributor avatar tags from Minotar
  - Bilibili video block rendering in instructions and notes
  - direct link behavior that auto-opens the correct facility modal
- Migration notes:
  - do not flatten the modal content model into plain strings
  - keep status meaning for `online`, `maintenance`, and `offline`

### Towns Page

- Source files:
  - `old-html-ver/towns.html`
  - `old-html-ver/js/towns_script.js`
  - `old-html-ver/css/pages/towns.css`
- Data source:
  - `public/data/towns.json`
- Must preserve:
  - search input
  - scale, type, and recruitment filters
  - town card layout with logo image or gradient fallback
  - icon badge meanings for scale, type, and recruitment
  - detail modal structure
  - founders and members sections with avatars
  - coordinates secrecy behavior when `coordinatesSecret === true`
  - direct link behavior that auto-opens the correct town modal
- Migration notes:
  - keep gradient fallback behavior when no logo exists
  - do not expose coordinates if the legacy data marks them as secret

### Stats Page

- Source files:
  - `old-html-ver/stats.html`
  - `old-html-ver/js/stats_script.js`
  - `old-html-ver/css/pages/stats.css`
- Data sources:
  - `public/stats/summary.json`
  - `public/stats/*.json`
  - generated by `scripts/statsprocess.py`
- Must preserve:
  - updated-at text display
  - six leaderboard blocks and their sort rules
  - searchable player grid
  - incremental load-more pagination with page size 24
  - player modal summary fields
  - lazy loading of per-player detail JSON when a modal opens
  - accordion structure for categorized detailed stats
  - search inside large accordion sections
- Migration notes:
  - do not swap in `src/demoData.js` player samples
  - do not hand-edit generated stats JSON files
  - keep raw sort semantics for `walk_raw` and `play_time_raw`

### Sponsor Page

- Source files:
  - `old-html-ver/sponsor.html`
  - `old-html-ver/js/sponsor_script.js`
  - `old-html-ver/css/pages/sponsor.css`
  - `old-html-ver/js/data_utils.js`
- Data sources:
  - `public/data/sponsors.txt`
  - `public/data/fund_progress.txt` when referenced by the page
- Must preserve:
  - animated cumulative total amount display
  - search input
  - project filter generation from real sponsor data
  - sponsor grid card layout and order
  - sponsor modal with separate desktop QR and mobile button views
  - mobile detection behavior
  - empty state and load failure fallback text
- Migration notes:
  - continue parsing `data/sponsors.txt` as `name, project, amount, [date]`
  - keep newest-first display order by reversing the parsed list

### Join Page

- Source files:
  - `old-html-ver/join.html`
  - `old-html-ver/js/join_script.js`
  - `old-html-ver/css/pages/join.css`
  - `old-html-ver/js/marked.min.js`
- Data source:
  - `public/data/convention.md`
- Must preserve:
  - four-step wizard structure
  - progress indicator states
  - markdown loading for the convention step
  - checkbox gating for agreement
  - device selection cards
  - Java and Bedrock edition toggle behavior
  - launcher recommendation blocks per device and edition
  - previous and next button states
  - final step button set and tutorial rendering flow
- Migration notes:
  - keep the lazy generation of step-3 tutorial content tied to the selected device and edition
  - using a markdown parser is acceptable because the legacy page already relies on one

### Doc, Map, And Photo Pages

- Source files:
  - `old-html-ver/doc.html`
  - `old-html-ver/map.html`
  - `old-html-ver/photo.html`
- Must preserve:
  - navbar only plus fullscreen iframe layout
  - inline page sizing behavior with the 44px navbar offset
  - external iframe targets exactly as in the legacy site
  - page-specific head metadata and structured data
- Migration notes:
  - do not over-engineer these pages
  - do not wrap them in extra containers that change the viewport sizing behavior

## Demo Removal Rules

- Remove the temporary showcase narrative from `src/App.vue` before treating migration as complete.
- Remove imports from `src/demoData.js` from any real page entry.
- Do not leave placeholder hero copy such as component review or UI audit text in production-facing pages.
- If demo data is still needed for isolated component development, keep it out of real page entry files and public routes.

## Styling Rules

- Preserve the legacy CSS variable language and visual rhythm from `old-html-ver/css/style.css`.
- Match legacy spacing, card density, section order, control grouping, icon usage, and breakpoint behavior.
- Preserve hover states, animation cadence, focus states, and modal open-close feel where they are visible to users.
- Avoid large global style rewrites before parity is reached.

## Interaction And Data Rules

- Prefer Vue state and template bindings over direct DOM mutation, but keep the visible behavior identical.
- Keep fetch paths relative for local files.
- Maintain current external integrations:
  - `https://api.mcstatus.io/v2/status/java/mcpure.lunadeer.cn`
  - `https://minotar.net/...`
  - `https://crafatar.com/...`
  - Bilibili embed iframes
  - `https://schema.lunadeer.cn/...`
  - `https://mcmap.lunadeer.cn/`
  - `https://mcphoto.lunadeer.cn/`
- Render fallback text instead of crashing when remote requests fail, matching the legacy behavior.

## Recommended Migration Order

1. Replace the review shell architecture so the project can serve legacy page URLs.
2. Wire shared layout pieces to match `old-html-ver/js/components.js` and `old-html-ver/css/style.css` precisely.
3. Migrate the simple iframe pages: `doc.html`, `map.html`, `photo.html`.
4. Migrate the filter-and-modal data pages: announcements, facilities, towns.
5. Migrate sponsor and stats using the real public data files.
6. Migrate the join wizard with markdown rendering.
7. Migrate the home page with live status, timers, sponsor totals, and crowdfunding.
8. Remove any remaining demo-only entry points and data.

## Verification Checklist

- Compare new and old pages side by side on desktop and mobile.
- Check that page order, section order, and copy match.
- Check that filters, searches, empty states, and modal behavior match.
- Check deep links for announcements, facilities, and towns, including direct access that auto-opens the correct item or modal.
- Check the home page timer, subtitle rotation, copy-to-clipboard behavior, and live status fallbacks.
- Check stats leaderboard sorting, player search, pagination, and lazy-loaded details.
- Check sponsor total animation, project filters, and desktop vs mobile donation modal content.
- Check join wizard gating, device selection, edition toggle, and markdown rendering.
- Check iframe pages fill the viewport correctly below the fixed navbar.
- Check no production route depends on `src/demoData.js`.
- Check head metadata, structured data, and canonical URLs are preserved for each migrated page.

## When Generating New Vue Code

- State the exact legacy page being migrated.
- List the specific legacy files used as the source of truth.
- Explain which existing Vue components are being reused and why they still allow exact parity.
- If adding a new component or composable, explain what legacy behavior requires it.
- Treat parity regressions as bugs, even if the Vue implementation looks cleaner internally.