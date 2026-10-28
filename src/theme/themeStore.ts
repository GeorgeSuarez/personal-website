import { STORAGE_KEY, type Theme } from "./themes.ts";

const FAB_COLLAPSED_KEY = "portfolio-theme-fab-collapsed";

export interface ThemeStore {
  /** Returns the raw stored value; callers validate it before use. */
  read: () => string | null;
  write: (theme: Theme) => void;
}

export const localStorageThemeStore: ThemeStore = {
  read() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  write(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  },
};

/** Remembers whether the theme fab is minimized to just its swatch. */
export const localStorageFabCollapsedStore = {
  read(): boolean {
    try {
      return localStorage.getItem(FAB_COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  },
  write(collapsed: boolean) {
    try {
      localStorage.setItem(FAB_COLLAPSED_KEY, String(collapsed));
    } catch {
      /* ignore */
    }
  },
};
