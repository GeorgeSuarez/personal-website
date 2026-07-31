import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./useTheme";
import { DEFAULT_THEME, isTheme, type Theme } from "./themes";
import { localStorageThemeStore } from "./themeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorageThemeStore.read();
    return stored !== null && isTheme(stored) ? stored : DEFAULT_THEME;
  });

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorageThemeStore.write(next);
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    if (theme === "cyberpunk") {
      el.removeAttribute("data-theme");
    } else {
      el.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
