# CONTEXT.md — Domain Glossary

The vocabulary that names the good seams in this codebase. Architecture reviews and design work should use these terms.

## Theme

The visual identity of the site. A **Theme** is one entry in the catalog (`src/theme/themes.ts`): an id, a label, and an accent color. Exactly one theme is active at a time; the active theme drives the `data-theme` attribute on `<html>` and the CSS variables in `src/index.css`. The `cyberpunk` theme is the implicit default (no attribute).

- **Theme catalog** — the single source of truth for the theme list: order, labels, accents. `nextTheme()` is the pure successor function; the selector and the `ctrl+shift+r` shortcut both consume it.
- **Theme store** — the persistence adapter behind the Theme module's seam (`src/theme/themeStore.ts`): reads/writes the active theme to `localStorage`. One real adapter today (localStorage); an in-memory fake is the second adapter for tests.
- **Theme module** — the deep module owning "which theme is active" (`src/theme/ThemeProvider.tsx` + `src/theme/useTheme.ts`). Interface: `useTheme() → { theme, setTheme }`.

## AppChrome

The global UI chrome surrounding the routed content: the theme selector, the help overlay, the mobile theme FAB, and the `ctrl+shift` keyboard shortcuts that drive them (`src/components/AppChrome.tsx`). Owns the selector/help open state — this is UI state, distinct from theme state.

## Keyboard shortcut

A global key combination registered in AppChrome:

- `ctrl+shift+t` — open theme selector
- `ctrl+shift+r` — cycle to `nextTheme(theme)`
- `ctrl+shift+h` — open help overlay

Documented for users in the help overlay (`HelpOverlay.tsx`).

## Menu

The Hero's keyboard-navigable list of items (Projects, Resume, GitHub, LinkedIn, Contact Me). An item is either an action that scrolls to an inline section (Projects) or an external link. The selection index and arrow-key navigation live in `Hero.tsx`.

## Overlay

A modal surface rendered over the page. `ThemeSelector` and `HelpOverlay` are the two overlays that remain; they hand-roll the same chrome (backdrop, escape-to-close, header) — a known shallow seam to deepen.

## Project

Portfolio content. Projects are currently embedded as module-level data inside their presentational module (`Projects.tsx`); some entries are duplicated in `Resume.tsx` under different shapes — a known friction point.
