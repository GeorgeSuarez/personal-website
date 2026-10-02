import { useState, useEffect } from "react";
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
  "block px-3 py-1.5 text-lg sm:text-xl tracking-[0.2em] uppercase text-muted transition-colors hover:bg-yellow/10 hover:text-yellow focus:bg-yellow/10 focus:text-yellow focus:outline-none whitespace-nowrap";

const submenuTriggerId = (submenuId: string): string => `${submenuId}-menu-trigger`;
const submenuPanelId = (submenuId: string): string => `${submenuId}-submenu`;

/** Whether the given submenu is the open one or one of its ancestors. */
function isSubmenuOpen(submenuId: SubmenuId, openSubmenuId: SubmenuId | null): boolean {
  let currentId = openSubmenuId;
  while (currentId !== null) {
    if (currentId === submenuId) return true;
    currentId = submenus[currentId].parentId;
  }
  return false;
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
      className={`ml-10 border-l border-cyan/30 pl-4 ${
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
                className={`${submenuItemClassName} w-full text-left cursor-pointer`}
              >
                {item.label}
                <span className="ml-3 text-sm tracking-normal text-cyan/70" aria-hidden="true">
                  {nestedIsOpen ? "−" : "+"}
                </span>
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

  const toggleSubmenu = (submenuId: SubmenuId) => {
    setOpenSubmenuId((openId) => (openId === submenuId ? submenus[submenuId].parentId : submenuId));
  };

  const activateItem = (item: HeroMenuItem) => {
    if (item.kind === "link") {
      if (item.href.startsWith("mailto:")) {
        window.location.href = item.href;
      } else {
        window.open(item.href, "_blank", "noopener,noreferrer");
      }
      return;
    }

    if (item.kind === "submenu") {
      toggleSubmenu(item.submenuId);
      return;
    }

    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectItem = (index: number) => {
    setSelectedIndex(index);
    const item = menuItems[index];
    if (item) activateItem(item);
  };

  useEffect(() => {
    const selectedItem = menuItems[selectedIndex];
    const selectedSubmenuId = selectedItem?.kind === "submenu" ? selectedItem.submenuId : null;
    if (selectedSubmenuId === null || !isSubmenuOpen(selectedSubmenuId, openSubmenuId)) {
      setOpenSubmenuId(null);
    }
  }, [openSubmenuId, selectedIndex]);

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
        setSelectedIndex(nextIndex);

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
        const selectedItem = menuItems[selectedIndex];
        if (selectedItem) activateItem(selectedItem);
        return;
      }

      const index = Number(e.key) - 1;
      if (!Number.isInteger(index) || index < 0 || index >= menuItems.length) return;

      selectItem(index);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSubmenuId, selectedIndex]);

  const scrollToMenu = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="hero-bg relative bg-background">
      <div className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 md:px-12">
        <div className="hero-card flex flex-col items-center text-center w-full max-w-4xl px-8 sm:px-24 py-6 sm:py-8">
          <h1 className="text-yellow text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-widest uppercase mb-4 sm:mb-6 name-glow whitespace-nowrap">
            George Suarez
          </h1>

          <p className="hero-badge inline-block text-background text-2xl sm:text-3xl md:text-4xl tracking-[0.3em] uppercase bg-cyan px-6 py-1.5 sm:px-8 sm:py-2 font-semibold mb-8 sm:mb-12">
            Software Engineer
          </p>

          <nav className="flex flex-col sm:gap-3 items-start w-full">
            {menuItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const submenuId = item.kind === "submenu" ? item.submenuId : null;
              const isOpen = submenuId !== null && isSubmenuOpen(submenuId, openSubmenuId);

              return (
                <div
                  key={item.label}
                  data-menu-index={index}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onFocus={() => setSelectedIndex(index)}
                >
                  <span className="group flex items-center gap-4 transition-all duration-200">
                    <span
                      className={`menu-arrow font-semibold text-2xl sm:text-3xl transition-all duration-200 ${
                        isSelected
                          ? "opacity-100 text-yellow active"
                          : "opacity-0 text-yellow/60 group-hover:opacity-60"
                      }`}
                      aria-hidden="true"
                    >
                      {">"}
                    </span>
                    {item.kind === "link" ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`menu-label ${isSelected ? "menu-selected" : ""} block px-5 py-1.5 text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all duration-200 hover:outline-none focus:outline-none whitespace-nowrap ${
                          isSelected
                            ? "bg-yellow text-background"
                            : "text-muted hover:bg-yellow/10 hover:text-yellow"
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
                        className={`menu-label ${isSelected ? "menu-selected" : ""} block px-5 py-1.5 text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all duration-200 hover:outline-none focus:outline-none text-left cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-yellow text-background"
                            : "text-muted hover:bg-yellow/10 hover:text-yellow"
                        }`}
                      >
                        {item.label}
                        {submenuId && (
                          <span
                            className="ml-3 text-sm tracking-normal text-cyan/70"
                            aria-hidden="true"
                          >
                            {isOpen ? "−" : "+"}
                          </span>
                        )}
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
            className="border border-cyan/30 text-cyan hover:border-cyan hover:bg-cyan/10 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase px-6 sm:px-8 py-3 transition-colors cursor-pointer"
          >
            &uarr; Back to menu
          </button>
        </div>
      </section>
    </div>
  );
}
