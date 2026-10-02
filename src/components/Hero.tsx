import { useState, useEffect } from "react";
import Projects from "./Projects";

type HeroMenuItem =
  | {
      readonly label: string;
      readonly kind: "action";
      readonly action: "projects" | "resume";
    }
  | {
      readonly label: string;
      readonly kind: "link";
      readonly href: string;
    };

const resumePdfPath = "/George_Suarez_Resume.pdf";
const resumePdfFilename = "George_Suarez_Resume.pdf";

const menuItems: ReadonlyArray<HeroMenuItem> = [
  { label: "Projects", kind: "action", action: "projects" },
  { label: "Resume", kind: "action", action: "resume" },
  { label: "GitHub", kind: "link", href: "https://github.com/georgesuarez" },
  { label: "LinkedIn", kind: "link", href: "https://linkedin.com/in/george-suarez" },
  { label: "Contact Me", kind: "link", href: "mailto:georgesuarezdev@gmail.com" },
];

const resumeMenuIndex = menuItems.findIndex(
  (item) => item.kind === "action" && item.action === "resume",
);

export default function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isResumeMenuOpen, setIsResumeMenuOpen] = useState(false);

  const activateItem = (item: HeroMenuItem) => {
    if (item.kind === "link") {
      if (item.href.startsWith("mailto:")) {
        window.location.href = item.href;
      } else {
        window.open(item.href, "_blank", "noopener,noreferrer");
      }
    } else if (item.action === "resume") {
      setIsResumeMenuOpen((isOpen) => !isOpen);
    } else {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (selectedIndex !== resumeMenuIndex) {
      setIsResumeMenuOpen(false);
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target instanceof HTMLElement ? e.target : null;

      if (e.key === "Escape" && isResumeMenuOpen) {
        e.preventDefault();
        setIsResumeMenuOpen(false);
        document.getElementById("resume-menu-trigger")?.focus();
        return;
      }

      const resumeSubmenu = target?.closest("#resume-submenu");
      if (resumeSubmenu) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          const submenuLinks = resumeSubmenu.querySelectorAll<HTMLAnchorElement>("a");
          const focusedLink = target?.closest<HTMLAnchorElement>("a");
          const focusedLinkIndex = Array.from(submenuLinks).findIndex(
            (link) => link === focusedLink,
          );

          if (focusedLinkIndex !== -1) {
            e.preventDefault();
            const delta = e.key === "ArrowUp" ? -1 : 1;
            const nextLinkIndex =
              (focusedLinkIndex + delta + submenuLinks.length) % submenuLinks.length;
            submenuLinks[nextLinkIndex]?.focus();
          }
        }
        return;
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const focusedMenuItem = target?.closest<HTMLElement>("[data-menu-index]");
        const focusedMenuIndex = focusedMenuItem ? Number(focusedMenuItem.dataset.menuIndex) : -1;
        const hasFocusedMenuItem = focusedMenuIndex >= 0 && focusedMenuIndex < menuItems.length;

        if (e.key === "ArrowDown" && isResumeMenuOpen && focusedMenuIndex === resumeMenuIndex) {
          e.preventDefault();
          document.querySelector<HTMLAnchorElement>("#resume-submenu a")?.focus();
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

      setSelectedIndex(index);
      const selectedItem = menuItems[index];
      if (selectedItem) activateItem(selectedItem);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResumeMenuOpen, selectedIndex]);

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
              const isResumeItem = item.kind === "action" && item.action === "resume";

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
                        id={isResumeItem ? "resume-menu-trigger" : undefined}
                        type="button"
                        aria-expanded={isResumeItem ? isResumeMenuOpen : undefined}
                        aria-controls={isResumeItem ? "resume-submenu" : undefined}
                        onClick={() => activateItem(item)}
                        className={`menu-label ${isSelected ? "menu-selected" : ""} block px-5 py-1.5 text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all duration-200 hover:outline-none focus:outline-none text-left cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-yellow text-background"
                            : "text-muted hover:bg-yellow/10 hover:text-yellow"
                        }`}
                      >
                        {item.label}
                        {isResumeItem && (
                          <span
                            className="ml-3 text-sm tracking-normal text-cyan/70"
                            aria-hidden="true"
                          >
                            {isResumeMenuOpen ? "−" : "+"}
                          </span>
                        )}
                      </button>
                    )}
                  </span>
                  {isResumeItem && (
                    <div
                      id="resume-submenu"
                      role="group"
                      aria-label="Resume options"
                      className={`ml-10 border-l border-cyan/30 pl-4 ${
                        isResumeMenuOpen ? "mt-1 flex flex-col gap-1" : "hidden"
                      }`}
                    >
                      <a
                        href={resumePdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-1.5 text-lg sm:text-xl tracking-[0.2em] uppercase text-muted transition-colors hover:bg-yellow/10 hover:text-yellow focus:bg-yellow/10 focus:text-yellow focus:outline-none whitespace-nowrap"
                      >
                        View PDF
                      </a>
                      <a
                        href={resumePdfPath}
                        download={resumePdfFilename}
                        className="block px-3 py-1.5 text-lg sm:text-xl tracking-[0.2em] uppercase text-muted transition-colors hover:bg-yellow/10 hover:text-yellow focus:bg-yellow/10 focus:text-yellow focus:outline-none whitespace-nowrap"
                      >
                        Download PDF
                      </a>
                    </div>
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
