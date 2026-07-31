import { createContext, useContext } from "react";
import { DEFAULT_THEME, type Theme } from "./themes";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export type { Theme } from "./themes";
