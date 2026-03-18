---
description: "Use when rebuilding old-html-ver pages into Vue UI components, page layouts, composables, or styles for the bailuyuan website. Covers component extraction, custom UI design, and canonical legacy pattern selection."
name: "Vue UI Migration"
applyTo: "src/**/*.vue, src/**/*.js, src/**/*.css"
---
# Bailuyuan Vue UI Migration Guidelines

## Goal

- Rebuild the legacy pages in `old-html-ver/` with Vue 3 components in `src/`.
- Do not use external UI component libraries.
- Recreate the site's visual language from the legacy HTML/CSS, but normalize duplicated styles into a smaller, cleaner component system.
- When similar legacy UIs use different implementations, keep the strongest pattern and discard weaker duplicates.

## Source Priority

- Treat `old-html-ver/js/components.js` as the source of truth for shared layout primitives: navbar, mobile menu, page hero, footer.
- Treat `old-html-ver/css/style.css` as the source of truth for global tokens and shared layout behavior.
- Treat `old-html-ver/announcements.html`, `old-html-ver/facilities.html`, and `old-html-ver/towns.html` plus their page CSS as the canonical source for search, filter, card, badge, and detail interaction patterns.
- Treat `old-html-ver/index.html` as the source for the home-page-only bento grid and hero interaction patterns.
- Treat `old-html-ver/stats.html`, `old-html-ver/sponsor.html`, and `old-html-ver/join.html` as sources for page-specific specialized components, not as the default style baseline for shared controls.

## Canonical Pattern Choices

- Use the announcements/facilities/towns control bar as the standard filter UI:
  - card-like `controls-section`
  - `search-box` with leading icon
  - labeled `filter-group`
  - pill `filter-tag` buttons with a strong active state
- Prefer the facilities/towns card and modal structure as the base pattern for data-detail pages.
- Keep the announcement timeline as a dedicated page pattern instead of forcing it into the facilities/towns card layout.
- Keep leaderboard cards, donation cards, and join wizard cards as specialized components that inherit shared spacing, radius, shadow, and button rules from base UI primitives.
- If a sponsor or stats page control differs from the announcements/facilities/towns version, default to the latter unless the page has a real functional need for a custom variant.

## Components To Extract First

- Layout primitives:
  - `SiteNavbar`
  - `MobileNavDrawer`
  - `PageHero`
  - `SiteFooter`
- Base UI primitives:
  - `BaseButton`
  - `BaseCard`
  - `BaseModal`
  - `BaseBadge`
  - `SearchBox`
  - `FilterTagGroup`
  - `EmptyState`
  - `LoadMoreButton`
- Shared content components:
  - `FilterPanel`
  - `FacilityCard`
  - `TownCard`
  - `AnnouncementTimeline`
  - `AnnouncementCard`
  - `LeaderboardCard`
  - `PlayerCard`
  - `DonationCard`
  - `FeatureBentoGrid`
  - `FeatureBentoCard`
  - `JoinWizard`
  - `DeviceCard`
  - `PlaystyleCard`
- Detail components:
  - `FacilityDetailModal`
  - `TownDetailModal`
  - `PlayerDetailModal`
  - `SponsorModal`
  - `ModalSection`

## Expected Component Responsibilities

- Shared components must be prop-driven and reusable across multiple pages.
- Page components should compose shared components instead of duplicating old HTML blocks.
- Data-driven sections should accept structured props for badges, coordinates, contributor lists, rich text blocks, media blocks, and status labels.
- Repeated filter and search logic should move into Vue composables instead of being reimplemented in each page.

## Styling Rules

- Keep the site's existing visual direction: soft cards, rounded corners, translucent navigation, strong hero imagery, restrained shadows, and Chinese content-first spacing.
- Reuse the legacy CSS variable vocabulary where it still makes sense, but consolidate it in the Vue codebase instead of copying page CSS wholesale.
- Do not copy-paste duplicated legacy class trees unless they are the chosen canonical pattern.
- Normalize spacing, radii, shadows, and interactive states across components.
- Preserve responsive behavior from the legacy site, especially navbar/mobile menu, hero scaling, filter wrapping, grid collapse, and modal usability.
- When creating styles, prefer local component styles or clearly organized shared styles over page-specific one-off overrides.

## Architecture Rules For Vue Work

- Build shared primitives before page-specific wrappers.
- Use slots only when content structure truly varies; otherwise use typed props with clear names.
- Keep interaction state inside the component or a focused composable such as search, filtering, modal visibility, and pagination.
- Avoid direct DOM manipulation when Vue state and template bindings can express the behavior.
- Preserve current data contracts from `public/data/` and `public/stats/` unless the task explicitly includes changing them.

## Legacy To Vue Mapping

- `components.js` navbar/footer/hero -> shared layout components.
- Announcements page -> `FilterPanel` + `AnnouncementTimeline` + expandable `AnnouncementCard`.
- Facilities page -> `FilterPanel` + `FacilityCard` grid + `FacilityDetailModal`.
- Towns page -> `FilterPanel` + `TownCard` grid + `TownDetailModal`.
- Stats page -> `LeaderboardCard` grid + `PlayerCard` grid + `PlayerDetailModal` + pagination controls.
- Sponsor page -> `DonationCard` grid + `SponsorModal`, while still reusing shared search and filter primitives.
- Join page -> `JoinWizard`, `ProgressStep`, `DeviceCard`, `EditionToggle`, `PlaystyleCard`.
- Home page -> `PageHero` specialization + `FeatureBentoGrid` + sponsor highlight section.

## What To Avoid

- Do not introduce Element Plus, Vuetify, Naive UI, Ant Design Vue, or similar UI kits.
- Do not keep one Vue component per old HTML page section if the section is really a shared pattern.
- Do not preserve inconsistent legacy styling just because it already exists.
- Do not port legacy imperative JavaScript event wiring directly into Vue components.
- Do not silently invent a new visual language that ignores the old site structure and tone.

## Default Implementation Bias

- If multiple legacy versions exist, choose the version that is clearer, more reusable, and visually more stable.
- For search and filtering, bias toward the announcements/facilities/towns implementation.
- For detail dialogs, bias toward the facilities/towns modal structure.
- For cards on data listing pages, bias toward the facilities/towns content density instead of the lighter sponsor/stats cards unless the page truly needs the lighter form.

## When Generating New Vue UI

- State which legacy page and which legacy pattern you are mapping from.
- List which shared component should be reused before creating a new one.
- If creating a new component, explain why an existing shared primitive is insufficient.
- Keep markup semantic and accessible: buttons for actions, labels for fields, dialog semantics for modals, keyboard-friendly navigation states.