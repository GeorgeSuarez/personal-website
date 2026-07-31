import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./useTheme";
import ThemeSelector from "../components/ThemeSelector";
import HelpOverlay from "../components/HelpOverlay";
import ThemeFab from "../components/ThemeFab";

const STORAGE_KEY = "portfolio-theme";
const ALL_THEMES: Theme[] = ["cyberpunk", "forge", "guild", "achievement", "ledger", "merch", "prism"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Theme>("achievement");

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const setTheme = (theme: Theme) => {
    setMode(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  const cycleTheme = () => {
    setMode((prev) => {
      const index = ALL_THEMES.indexOf(prev);
      return ALL_THEMES[(index + 1) % ALL_THEMES.length];
    });
  };

  const openSelector = () => setSelectorOpen(true);
  const closeSelector = () => setSelectorOpen(false);
  const closeHelp = () => setHelpOpen(false);

  useEffect(() => {
    const el = document.documentElement;
    if (mode === "cyberpunk") {
      el.removeAttribute("data-theme");
    } else {
      el.setAttribute("data-theme", mode);
    }
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        setSelectorOpen(true);
        return;
      }

      if (e.ctrlKey && e.shiftKey && e.key === "R") {
        e.preventDefault();
        setMode((prev) => {
          const index = ALL_THEMES.indexOf(prev);
          return ALL_THEMES[(index + 1) % ALL_THEMES.length];
        });
        return;
      }

      if (e.ctrlKey && e.shiftKey && e.key === "H") {
        e.preventDefault();
        setHelpOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ mode, setTheme, cycleTheme, selectorOpen, openSelector, closeSelector }}
    >
      {children}
      <ThemeFab />
      {selectorOpen && <ThemeSelector />}
      {helpOpen && <HelpOverlay onClose={closeHelp} />}
    </ThemeContext.Provider>
  );
}
