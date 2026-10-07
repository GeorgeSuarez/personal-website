import { useCallback, useEffect, useState } from "react";
import Projects from "./Projects";

type SubmenuId = "resume" | "download";

type SubmenuLink = {
  readonly kind: "link";
  readonly label: string;
  readonly href: string;
  /** When set, the browser saves the file with this name instead of opening it in a tab. */
  readonly filename?: string;
};

type SubmenuTrigger = {
  readonly kind: "submenu";
  readonly label: string;
  readonly submenuId: SubmenuId;
};

type SubmenuItem = SubmenuLink | SubmenuTrigger;

type Submenu = {
  readonly ariaLabel: string;
  readonly parentId: SubmenuId | null;
  readonly items: ReadonlyArray<SubmenuItem>;
};

type HeroMenuItem =
  | {
      readonly label: string;
      readonly kind: "projects";
    }
  | {
      readonly label: string;
      readonly kind: "submenu";
      readonly submenuId: SubmenuId;
    }
  | {
      readonly label: string;
      readonly kind: "link";
      readonly href: string;
    };

const resumeFilenameBase = "George_Suarez_Resume";

const resumeFiles = {
  pdf: `${resumeFilenameBase}.pdf`,
  docx: `${resumeFilenameBase}.docx`,
  txt: `${resumeFilenameBase}.txt`,
  html: `${resumeFilenameBase}.html`,
  markdown: `${resumeFilenameBase}.md`,
} as const;

const submenus: Record<SubmenuId, Submenu> = {
  resume: {
    ariaLabel: "Resume options",
    parentId: null,
    items: [
      { kind: "link", label: "View PDF", href: `/${resumeFiles.pdf}` },
      { kind: "submenu", label: "Download", submenuId: "download" },
    ],
  },
  download: {
    ariaLabel: "Resume download formats",
    parentId: "resume",
    items: [
      { kind: "link", label: "PDF", href: `/${resumeFiles.pdf}`, filename: resumeFiles.pdf },
      { kind: "link", label: "DOCX", href: `/${resumeFiles.docx}`, filename: resumeFiles.docx },
      { kind: "link", label: "TXT", href: `/${resumeFiles.txt}`, filename: resumeFiles.txt },
      { kind: "link", label: "HTML", href: `/${resumeFiles.html}`, filename: resumeFiles.html },
      {
        kind: "link",
        label: "Markdown",
        href: `/${resumeFiles.markdown}`,
        filename: resumeFiles.markdown,
      },
    ],
  },
};

const menuItems: ReadonlyArray<HeroMenuItem> = [
  { label: "Projects", kind: "projects" },
  { label: "Resume", kind: "submenu", submenuId: "resume" },
  { label: "GitHub", kind: "link", href: "https://github.com/georgesuarez" },
  { label: "LinkedIn", kind: "link", href: "https://linkedin.com/in/george-suarez" },
  { label: "Contact Me", kind: "link", href: "mailto:georgesuarezdev@gmail.com" },
];

const submenuItemClassName =
  "submenu-item px-3 text-muted transition-colors focus:bg-yellow/10 focus:text-yellow";

const submenuTriggerId = (submenuId: string): string => `${submenuId}-menu-trigger`;

const submenuPanelId = (submenuId: string): string => `${submenuId}-submenu`;

/** mailto links open in place; every other link opens in a new tab. */
const isMailtoHref = (href: string): boolean => href.startsWith("mailto:");

/** Whether the given submenu is the open one or one of its ancestors. */
function isSubmenuOpen(submenuId: SubmenuId, openSubmenuId: SubmenuId | null): boolean {
  let currentId = openSubmenuId;

  while (currentId !== null) {
    if (currentId === submenuId) return true;
    currentId = submenus[currentId].parentId;
  }

  return false;
}

/** Click the anchor the menu already renders instead of navigating programmatically. */
function activateLink(index: number): void {
  document.querySelector<HTMLAnchorElement>(`[data-menu-index="${index}"] a`)?.click();
}

function scrollToMenu(): void {
  window.scrollTo({ top: 0 });
}

type HeroSubmenuProps = {
  readonly submenuId: SubmenuId;
  readonly openSubmenuId: SubmenuId | null;
  readonly onToggleSubmenu: (submenuId: SubmenuId) => void;
};

/** Render a submenu panel, recursively rendering any nested submenus. */
function HeroSubmenu({ submenuId, openSubmenuId, onToggleSubmenu }: HeroSubmenuProps) {
  const submenu = submenus[submenuId];

  return (
    <div
      id={submenuPanelId(submenuId)}
      data-submenu-panel={submenuId}
      role="group"
      aria-label={submenu.ariaLabel}
      className={`ms-10 border-s border-cyan/30 ps-4 ${
        isSubmenuOpen(submenuId, openSubmenuId) ? "mt-1 flex flex-col gap-1" : "hidden"
      }`}
    >
      {submenu.items.map((item) => {
        if (item.kind === "submenu") {
          const nestedIsOpen = openSubmenuId === item.submenuId;

          return (
            <div key={item.label} className="flex flex-col">
              <button
                id={submenuTriggerId(item.submenuId)}
                type="button"
                data-submenu-item
                data-submenu-trigger={item.submenuId}
                aria-expanded={nestedIsOpen}
                aria-controls={submenuPanelId(item.submenuId)}
                onClick={() => onToggleSubmenu(item.submenuId)}
                className={`${submenuItemClassName} w-full text-start cursor-pointer`}
              >
                {item.label}
              </button>
              <HeroSubmenu
                submenuId={item.submenuId}
                openSubmenuId={openSubmenuId}
                onToggleSubmenu={onToggleSubmenu}
              />
            </div>
          );
        }

        return (
          <a
            key={item.label}
            href={item.href}
            download={item.filename}
            target={item.filename ? undefined : "_blank"}
            rel={item.filename ? undefined : "noopener noreferrer"}
            data-submenu-item
            className={submenuItemClassName}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
}

export default function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openSubmenuId, setOpenSubmenuId] = useState<SubmenuId | null>(null);

  const toggleSubmenu = useCallback((submenuId: SubmenuId) => {
    setOpenSubmenuId((openId) => (openId === submenuId ? submenus[submenuId].parentId : submenuId));
  }, []);

  /** Move the selection, closing any submenu the newly selected item does not own. */
  const selectIndex = useCallback((index: number) => {
    setSelectedIndex(index);
    setOpenSubmenuId((openId) => {
      const item = menuItems[index];
      const submenuId = item?.kind === "submenu" ? item.submenuId : null;

      return submenuId !== null && isSubmenuOpen(submenuId, openId) ? openId : null;
    });
  }, []);

  const selectItem = useCallback(
    (index: number) => {
      selectIndex(index);
      const item = menuItems[index];

      if (!item) return;

      if (item.kind === "link") {
        activateLink(index);

        return;
      }

      if (item.kind === "submenu") {
        toggleSubmenu(item.submenuId);

        return;
      }

      document.getElementById("projects")?.scrollIntoView();
    },
    [selectIndex, toggleSubmenu],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target instanceof HTMLElement ? e.target : null;

      if (e.key === "Escape" && openSubmenuId) {
        e.preventDefault();
        const closedSubmenuId = openSubmenuId;
        setOpenSubmenuId(submenus[closedSubmenuId].parentId);
        document.getElementById(submenuTriggerId(closedSubmenuId))?.focus();

        return;
      }

      const submenuPanel = target?.closest<HTMLElement>("[data-submenu-panel]");

      if (submenuPanel) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          const panelItems = Array.from(
            submenuPanel.querySelectorAll<HTMLElement>("[data-submenu-item]"),
          ).filter((item) => item.closest("[data-submenu-panel]") === submenuPanel);

          const focusedItem = target?.closest<HTMLElement>("[data-submenu-item]");
          const focusedItemIndex = focusedItem ? panelItems.indexOf(focusedItem) : -1;
          const nestedSubmenuId = focusedItem?.dataset.submenuTrigger;

          if (e.key === "ArrowDown" && nestedSubmenuId && nestedSubmenuId === openSubmenuId) {
            e.preventDefault();
            document
              .querySelector<HTMLElement>(`#${submenuPanelId(nestedSubmenuId)} [data-submenu-item]`)
              ?.focus();

            return;
          }

          if (focusedItemIndex !== -1) {
            e.preventDefault();
            const delta = e.key === "ArrowUp" ? -1 : 1;
            const nextIndex = (focusedItemIndex + delta + panelItems.length) % panelItems.length;
            panelItems[nextIndex]?.focus();
          }
        }

        return;
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const focusedMenuItem = target?.closest<HTMLElement>("[data-menu-index]");
        const focusedMenuIndex = focusedMenuItem ? Number(focusedMenuItem.dataset.menuIndex) : -1;
        const hasFocusedMenuItem = focusedMenuIndex >= 0 && focusedMenuIndex < menuItems.length;
        const focusedItem = hasFocusedMenuItem ? menuItems[focusedMenuIndex] : undefined;
        const focusedSubmenuId = focusedItem?.kind === "submenu" ? focusedItem.submenuId : null;

        if (
          e.key === "ArrowDown" &&
          focusedSubmenuId &&
          isSubmenuOpen(focusedSubmenuId, openSubmenuId)
        ) {
          e.preventDefault();
          document
            .querySelector<HTMLElement>(`#${submenuPanelId(focusedSubmenuId)} [data-submenu-item]`)
            ?.focus();

          return;
        }

        e.preventDefault();
        const delta = e.key === "ArrowUp" ? -1 : 1;

        const nextIndex = hasFocusedMenuItem
          ? (focusedMenuIndex + delta + menuItems.length) % menuItems.length
          : (selectedIndex + delta + menuItems.length) % menuItems.length;

        selectIndex(nextIndex);

        if (hasFocusedMenuItem) {
          document
            .querySelector<HTMLElement>(`[data-menu-index="${nextIndex}"] .menu-label`)
            ?.focus();
        }

        return;
      }

      if (e.key === "Enter") {
        if (target?.closest("button, a")) return;
        e.preventDefault();
        selectItem(selectedIndex);

        return;
      }

      const index = Number(e.key) - 1;

      if (!Number.isInteger(index) || index < 0 || index >= menuItems.length) return;

      selectItem(index);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSubmenuId, selectedIndex, selectIndex, selectItem]);

  return (
    <div className="hero-bg relative bg-background">
      <div className="min-h-svh flex flex-col items-center justify-center px-6 sm:px-10 md:px-12">
        <div className="hero-card flex flex-col items-center text-center w-full max-w-4xl px-4 sm:px-24 py-6 sm:py-8">
          <h1 className="hero-title text-yellow font-black uppercase mb-4 sm:mb-6 name-glow">
            George Suarez
          </h1>

          <p className="hero-badge inline-block text-background uppercase bg-cyan px-4 py-1.5 sm:px-8 sm:py-2 font-semibold mb-8 sm:mb-12">
            Software Engineer
          </p>

          <nav aria-label="Primary" className="flex flex-col sm:gap-3 items-start w-full">
            {menuItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const submenuId = item.kind === "submenu" ? item.submenuId : null;
              const isOpen = submenuId !== null && isSubmenuOpen(submenuId, openSubmenuId);
              const isExternalLink = item.kind === "link" && !isMailtoHref(item.href);

              return (
                <div
                  key={item.label}
                  data-menu-index={index}
                  onMouseEnter={() => selectIndex(index)}
                  onFocus={() => selectIndex(index)}
                  className="menu-entry"
                >
                  <span className="menu-row flex items-center gap-4">
                    <span
                      className={`menu-arrow font-semibold ${
                        isSelected ? "opacity-100 text-yellow active" : "opacity-0 text-yellow/60"
                      }`}
                      aria-hidden="true"
                    >
                      {">"}
                    </span>
                    {item.kind === "link" ? (
                      <a
                        href={item.href}
                        target={isExternalLink ? "_blank" : undefined}
                        rel={isExternalLink ? "noopener noreferrer" : undefined}
                        className={`menu-label ${isSelected ? "menu-selected" : ""} uppercase ${
                          isSelected ? "bg-yellow text-background" : "text-muted"
                        }`}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        id={submenuId ? submenuTriggerId(submenuId) : undefined}
                        type="button"
                        aria-expanded={submenuId ? isOpen : undefined}
                        aria-controls={submenuId ? submenuPanelId(submenuId) : undefined}
                        onClick={() => selectItem(index)}
                        className={`menu-label ${isSelected ? "menu-selected" : ""} uppercase text-start cursor-pointer ${
                          isSelected ? "bg-yellow text-background" : "text-muted"
                        }`}
                      >
                        {item.label}
                      </button>
                    )}
                  </span>
                  {submenuId && (
                    <HeroSubmenu
                      submenuId={submenuId}
                      openSubmenuId={openSubmenuId}
                      onToggleSubmenu={toggleSubmenu}
                    />
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center justify-center gap-3 mt-4 pb-3 sm:pb-4 select-none w-full max-w-4xl">
          <span className="h-px flex-1 max-w-16 sm:max-w-20 bg-cyan/40" />
          <span className="footer-hint text-cyan/70 text-lg sm:text-xl tracking-[0.2em] uppercase font-semibold">
            [ctrl+shift+h] help
          </span>
          <span className="h-px flex-1 max-w-16 sm:max-w-20 bg-cyan/40" />
        </div>
      </div>

      <section id="projects" className="px-6 sm:px-10 md:px-12 pb-20 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8 mt-4">
          <span className="text-cyan text-sm font-bold tracking-[0.25em] uppercase">
            ~/projects
          </span>
          <span className="h-px flex-1 bg-cyan/30" />
        </div>
        <Projects />
        <div className="mt-12 flex justify-center">
          <button
            onClick={scrollToMenu}
            className="back-to-menu border border-cyan/30 text-cyan text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase px-6 sm:px-8 py-3 cursor-pointer"
          >
            &uarr; Back to menu
          </button>
        </div>
      </section>
    </div>
  );
}
