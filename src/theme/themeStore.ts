import { STORAGE_KEY, type Theme } from "./themes";

export interface ThemeStore {
  read: () => Theme | null;
  write: (theme: Theme) => void;
}

export const localStorageThemeStore: ThemeStore = {
  read() {
    try {
      return localStorage.getItem(STORAGE_KEY) as Theme | null;
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
