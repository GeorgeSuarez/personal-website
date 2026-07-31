import { useEffect, type ReactNode } from "react";

interface TerminalOverlayProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function TerminalOverlay({
  title,
  onClose,
  children,
}: TerminalOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      style={{ animation: "fade-in 0.2s ease-out" }}
    >
      <div
        className="overlay-card relative bg-background border border-muted/20 w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "overlay-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b border-muted/20 bg-background z-10">
          <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-lg leading-none transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
