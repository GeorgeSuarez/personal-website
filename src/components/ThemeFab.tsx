import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { THEMES, type Theme } from "../theme/themes";
import { localStorageFabCollapsedStore } from "../theme/themeStore";
import { useTheme } from "../theme/useTheme";

const menuId = "theme-menu";

const optionSelector = '[role="menuitemradio"]';

interface ThemeMenuProps {
  readonly activeTheme: Theme;
  readonly onPick: (theme: Theme) => void;
  readonly onDismiss: () => void;
  readonly menuRef: React.RefObject<HTMLDivElement | null>;
}

function ThemeMenu({ activeTheme, onPick, onDismiss, menuRef }: ThemeMenuProps) {
  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      // Keep menu keystrokes away from the page-level menu shortcuts.
      event.stopPropagation();

      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();

        return;
      }

      if (event.key === "Tab") {
        onDismiss();

        return;
      }

      if (
        event.key !== "ArrowDown" &&
        event.key !== "ArrowUp" &&
        event.key !== "Home" &&
        event.key !== "End"
      ) {
        return;
      }

      const items = Array.from(
        menuRef.current?.querySelectorAll<HTMLButtonElement>(optionSelector) ?? [],
      );

      if (items.length === 0) return;

      event.preventDefault();
      const lastIndex = items.length - 1;
      const currentIndex = items.findIndex((item) => item === document.activeElement);
      let nextIndex = 0;

      if (event.key === "End") {
        nextIndex = lastIndex;
      } else if (event.key === "ArrowDown") {
        nextIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1;
      } else if (event.key === "ArrowUp") {
        nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
      }

      items[nextIndex]?.focus();
    },
    [menuRef, onDismiss],
  );

  return (
    <div
      id={menuId}
      ref={menuRef}
      role="menu"
      aria-label="Theme"
      className="theme-menu"
      onKeyDown={handleKeyDown}
    >
      {THEMES.map((option) => (
        <button
          key={option.id}
          type="button"
          role="menuitemradio"
          aria-checked={option.id === activeTheme}
          tabIndex={-1}
          onClick={() => onPick(option.id)}
          className="theme-menu__option"
        >
          <span
            className="theme-menu__swatch"
            style={{ backgroundColor: option.accent }}
            aria-hidden="true"
          />
          <span>{option.label}</span>
          {option.id === activeTheme && (
            <svg
              className="theme-menu__check"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m3.5 8.5 3 3 6-7" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}

/** Current theme with a dropdown picker; collapses to just its swatch. */
export default function ThemeFab() {
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(() => localStorageFabCollapsedStore.read());
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const activeTheme = THEMES.find((option) => option.id === theme);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((previous) => {
      const next = !previous;
      localStorageFabCollapsedStore.write(next);

      return next;
    });
  }, []);

  const dismissMenu = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const pickTheme = useCallback(
    (next: Theme) => {
      setTheme(next);
      dismissMenu();
    },
    [setTheme, dismissMenu],
  );

  useEffect(() => {
    if (!open) return;

    const options = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(optionSelector) ?? [],
    );

    const checkedOption = options.find((option) => option.getAttribute("aria-checked") === "true");
    const initialOption = checkedOption ?? options[0];

    initialOption?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      const { target } = event;

      if (!(target instanceof Node)) return;

      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (activeTheme === undefined) return null;

  return (
    <>
      <div className="theme-fab" data-collapsed={collapsed} data-open={open}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-label={`Change theme. Current theme: ${activeTheme.label}`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          title={collapsed ? activeTheme.label : undefined}
          className="theme-fab__trigger"
        >
          <span className="theme-fab__swatch" aria-hidden="true" />
          <span className="theme-fab__label">
            <span id="theme-fab-label" className="theme-fab__copy">
              <span className="theme-fab__caption">Current theme</span>
              <span className="theme-fab__name">{activeTheme.label}</span>
            </span>
          </span>
          <svg
            className="theme-fab__chevron"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>

        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-controls="theme-fab-label"
          aria-label={collapsed ? "Expand theme indicator" : "Minimize theme indicator"}
          className="theme-fab__toggle"
        >
          <svg
            className="theme-fab__toggle-icon"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="4.5" y1="8" x2="11.5" y2="8" />
            <line className="theme-fab__toggle-plus" x1="8" y1="4.5" x2="8" y2="11.5" />
          </svg>
        </button>
      </div>

      {open && (
        <ThemeMenu
          activeTheme={activeTheme.id}
          onPick={pickTheme}
          onDismiss={dismissMenu}
          menuRef={menuRef}
        />
      )}
    </>
  );
}
