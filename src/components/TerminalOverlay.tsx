import { useState, useEffect } from "react";
import type { ReactNode } from "react";

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
  const [expanded, setExpanded] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const expandTimer = setTimeout(() => {
      setExpanded(true);
    }, 300);

    const contentTimer = setTimeout(() => {
      setContentVisible(true);
    }, 1000);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      style={{
        animation: "terminal-backdrop 0.3s ease-out forwards",
      }}
    >
      <div
        className="relative border border-cyan/30 bg-background/95 backdrop-blur-sm shadow-[0_0_30px_rgba(0,240,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: expanded ? "56rem" : "320px",
          maxHeight: expanded ? "90vh" : "120px",
          width: "100%",
          overflow: expanded ? "auto" : "hidden",
          transition:
            "max-width 1.4s cubic-bezier(0.16, 1, 0.3, 1), max-height 1.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1.4s ease-out",
          boxShadow: expanded
            ? "0 0 40px rgba(0, 240, 255, 0.15), inset 0 0 60px rgba(0, 240, 255, 0.02)"
            : "0 0 20px rgba(0, 240, 255, 0.05)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan/20 bg-background/50 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-magenta/80" />
            <span className="w-3 h-3 rounded-full bg-yellow/80" />
            <span className="w-3 h-3 rounded-full bg-cyan/80" />
          </div>
          <span className="text-cyan/60 text-[16px] tracking-[0.2em] uppercase font-mono">
            {title}
          </span>
          <button
            onClick={onClose}
            className="text-cyan/60 hover:text-magenta text-xs tracking-wider uppercase transition-colors font-mono"
          >
            [x]
          </button>
        </div>

        <div
          className="px-4 py-3"
          style={{
            opacity: expanded ? 0 : 1,
            transition: "opacity 0.3s ease-out",
            height: expanded ? 0 : "auto",
            overflow: "hidden",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-cyan text-xs font-mono">
              root@netrunner:~$
            </span>
            <span className="text-muted text-xs tracking-wider font-mono">
              open {title}
            </span>
            <span
              className="inline-block w-2 h-3 bg-cyan animate-pulse"
              style={{ marginLeft: "2px" }}
            />
          </div>
        </div>

        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
            transform: contentVisible ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
