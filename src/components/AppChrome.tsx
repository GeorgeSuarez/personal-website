import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "../theme/useTheme";
import { nextTheme } from "../theme/themes";
import ThemeFab from "./ThemeFab";
import ThemeSelector from "./ThemeSelector";
import HelpOverlay from "./HelpOverlay";

export default function AppChrome({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        setSelectorOpen(true);
        return;
      }

      if (e.ctrlKey && e.shiftKey && e.key === "R") {
        e.preventDefault();
        setTheme(nextTheme(theme));
        return;
      }

      if (e.ctrlKey && e.shiftKey && e.key === "H") {
        e.preventDefault();
        setHelpOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme, setTheme]);

  return (
    <>
      {children}
      <ThemeFab onClick={() => setSelectorOpen(true)} />
      {selectorOpen && <ThemeSelector onClose={() => setSelectorOpen(false)} />}
      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
    </>
  );
}
