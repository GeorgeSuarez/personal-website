import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext } from "./useTheme";
import { DEFAULT_THEME, isTheme, type Theme } from "./themes";
import { localStorageThemeStore } from "./themeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorageThemeStore.read();

    return stored !== null && isTheme(stored) ? stored : DEFAULT_THEME;
  });

  const applyTheme = useCallback((next: Theme) => {
    setTheme(next);
    localStorageThemeStore.write(next);
  }, []);

  const contextValue = useMemo(() => ({ theme, setTheme: applyTheme }), [theme, applyTheme]);

  useEffect(() => {
    const el = document.documentElement;

    if (theme === "cyberpunk") {
      el.removeAttribute("data-theme");
    } else {
      el.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
