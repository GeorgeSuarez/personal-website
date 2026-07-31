import { useState, useEffect, useCallback } from "react";
import { useTheme, type Theme } from "../theme/useTheme";

const themes: { id: Theme; label: string; accent: string }[] = [
  { id: "cyberpunk", label: "Cyberpunk", accent: "#00f0ff" },
  { id: "forge", label: "Forge", accent: "#c85a17" },
  { id: "guild", label: "Guild Hall", accent: "#c9a84c" },
  { id: "achievement", label: "Achievement", accent: "#4a9eff" },
  { id: "ledger", label: "Ledger", accent: "#059669" },
  { id: "merch", label: "Merch", accent: "#ff6b35" },
  { id: "prism", label: "Prism", accent: "#7c4dff" },
];

export default function ThemeSelector() {
  const { mode, setTheme, closeSelector } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(
    themes.findIndex((t) => t.id === mode),
  );

  const select = useCallback(
    (theme: Theme) => {
      setTheme(theme);
      closeSelector();
    },
    [setTheme, closeSelector],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSelector();
        return;
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const delta = e.key === "ArrowUp" ? -1 : 1;
          return (prev + delta + themes.length) % themes.length;
        });
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        select(themes[selectedIndex].id);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, select, closeSelector]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeSelector}
      style={{ animation: "fade-in 0.2s ease-out" }}
    >
      <div
        className="overlay-card relative bg-background border border-muted/20 shadow-xl w-auto min-w-[16rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3 border-b border-muted/20">
          <h2 className="text-foreground text-xs font-semibold tracking-wider uppercase">
            Select Theme
          </h2>
        </div>

        <div className="p-2 flex flex-col gap-0.5">
          {themes.map((theme, index) => {
            const isSelected = index === selectedIndex;
            const isActive = theme.id === mode;
            return (
              <button
                key={theme.id}
                onClick={() => select(theme.id)}
                onMouseEnter={() => setSelectedIndex(index)}
                className="group flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 hover:outline-none focus:outline-none cursor-pointer hover:bg-muted/10 rounded"
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.accent }}
                />
                <span
                  className={`text-sm tracking-wide transition-colors duration-150 ${
                    isSelected
                      ? "text-foreground font-medium"
                      : "text-muted group-hover:text-foreground"
                  }`}
                >
                  {theme.label}
                </span>
                {isActive && (
                  <span className="text-[10px] tracking-wider uppercase text-muted/50 font-medium ml-auto">
                    active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-5 py-2.5 border-t border-muted/20">
          <span className="text-muted/50 text-[10px] tracking-wider uppercase">
            [esc] cancel
          </span>
        </div>
      </div>
    </div>
  );
}
