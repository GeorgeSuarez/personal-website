# Deepen the Theme module behind a single catalog

Status: accepted

The Theme module was split across shallow pieces with no locality: the theme catalog existed in three places (`ALL_THEMES`, the selector's `themes[]`, and the `[data-theme]` CSS blocks), the cycle logic was duplicated, and the persistence write to `localStorage` was never read back. We deepened it: `src/theme/themes.ts` is now the single source of truth (ids, labels, accents, order, plus the pure `nextTheme()`), `ThemeProvider` owns only "which theme is active" and exposes the small interface `useTheme() → { theme, setTheme }`, and persistence lives behind the `themeStore` seam (read + write; one real localStorage adapter, an in-memory fake is the second for tests). The `ctrl+shift` keyboard shortcuts and the selector/help overlay state moved out of the theme module into `AppChrome`.

Consequences: adding a theme means one catalog entry in `themes.ts` plus a `[data-theme]` CSS block — the CSS block cannot be generated from the catalog without a CSS-in-JS approach, so that pairing stays manual. The shortcut behavior in `AppChrome` and its documentation in `HelpOverlay` are two surfaces that must be updated together. The `themeStore` seam is hypothetical (one adapter) until tests add the second.
