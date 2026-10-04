import { STORAGE_KEY, type Theme } from "./themes";

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
