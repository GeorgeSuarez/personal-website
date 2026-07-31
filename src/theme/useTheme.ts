import { createContext, useContext } from "react";

export type Theme = "cyberpunk" | "forge" | "guild" | "achievement" | "ledger" | "merch" | "prism";

export interface ThemeContextType {
  mode: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  selectorOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: "cyberpunk",
  setTheme: () => {},
  cycleTheme: () => {},
  selectorOpen: false,
  openSelector: () => {},
  closeSelector: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}
