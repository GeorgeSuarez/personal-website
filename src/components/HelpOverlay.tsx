import { useEffect } from "react";

interface HelpOverlayProps {
  onClose: () => void;
}

const shortcuts: { keys: string; action: string }[] = [
  { keys: "ctrl+shift+h", action: "Show this help" },
  { keys: "ctrl+shift+t", action: "Open theme selector" },
  { keys: "ctrl+shift+r", action: "Cycle themes" },
  { keys: "↑ / ↓", action: "Navigate menu" },
  { keys: "enter", action: "Activate selected item" },
  { keys: "esc", action: "Close overlay" },
];

export default function HelpOverlay({ onClose }: HelpOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      style={{ animation: "fade-in 0.2s ease-out" }}
    >
      <div
        className="overlay-card relative bg-background border border-muted/30 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "overlay-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-muted/20">
          <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-lg leading-none transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.keys}
              className="flex items-baseline justify-between gap-4"
            >
              <span className="text-yellow text-sm font-semibold whitespace-nowrap font-mono">
                {shortcut.keys}
              </span>
              <span className="text-muted text-sm text-right">
                {shortcut.action}
              </span>
            </div>
          ))}
        </div>

        <div className="px-5 py-2.5 border-t border-muted/20">
          <span className="text-muted/50 text-[10px] tracking-wider uppercase">
            [esc] close
          </span>
        </div>
      </div>
    </div>
  );
}
