import { useState, useEffect } from "react";
import TerminalOverlay from "./TerminalOverlay";
import Projects from "./Projects";
import Skills from "./Skills";

interface MenuItem {
  label: string;
  href: string;
  external: boolean;
  overlay?: "projects" | "skills" | "resume";
}

const menuItems: MenuItem[] = [
  { label: "Projects", href: "#", external: false, overlay: "projects" },
  { label: "Skills", href: "#", external: false, overlay: "skills" },
  {
    label: "Resume",
    href: "https://docs.google.com/document/d/1UhSLU710_8HHWU7tvZG9tbA83dd_0L8IwUvfGo5BnXI/export?format=pdf",
    external: true,
    overlay: "resume",
  },
  { label: "GitHub", href: "https://github.com/georgesuarez", external: true },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/george-suarez",
    external: true,
  },
  {
    label: "Contact Me",
    href: "mailto:georgesuarezdev@gmail.com",
    external: true,
  },
];

export default function Hero() {
  const [activeOverlay, setActiveOverlay] = useState<
    null | "projects" | "skills" | "resume"
  >(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const activateItem = (item: MenuItem) => {
      if (item.external) {
        if (item.href.startsWith("mailto:")) {
          window.location.href = item.href;
        } else {
          window.open(item.href, "_blank", "noopener,noreferrer");
        }
      } else if (item.overlay) {
        setActiveOverlay(item.overlay);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeOverlay) {
        if (e.key === "Escape") {
          setActiveOverlay(null);
        }
        return;
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const delta = e.key === "ArrowUp" ? -1 : 1;
          return (prev + delta + menuItems.length) % menuItems.length;
        });
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        activateItem(menuItems[selectedIndex]);
        return;
      }

      const index = parseInt(e.key, 10) - 1;
      if (index < 0 || index >= menuItems.length) return;

      setSelectedIndex(index);
      activateItem(menuItems[index]);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeOverlay, selectedIndex]);

  const openResume = () => {
    window.open(
      "https://docs.google.com/document/d/1UhSLU710_8HHWU7tvZG9tbA83dd_0L8IwUvfGo5BnXI/export?format=pdf",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="hero-bg relative min-h-screen bg-background flex flex-col items-center justify-center px-6 sm:px-10 md:px-12">
      <div className="hero-card flex flex-col items-center text-center w-full max-w-4xl px-16 sm:px-24 py-6 sm:py-8">
        <h1 className="text-yellow text-6xl sm:text-7xl font-black tracking-widest uppercase mb-4 sm:mb-6 name-glow whitespace-nowrap">
          George Suarez
        </h1>

        <p className="hero-badge inline-block text-background text-2xl sm:text-3xl md:text-4xl tracking-[0.3em] uppercase bg-cyan px-6 py-1.5 sm:px-8 sm:py-2 font-semibold mb-8 sm:mb-12">
          Software Engineer
        </p>

        <nav className="flex flex-col sm:gap-3 items-start w-full">
          {menuItems.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={item.label}
                onMouseEnter={() => setSelectedIndex(index)}
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
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`menu-label ${isSelected ? "menu-selected" : ""} block px-5 py-1.5 text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all duration-200 hover:outline-none focus:outline-none ${
                        isSelected
                          ? "bg-yellow text-background"
                          : "text-muted hover:bg-yellow/10 hover:text-yellow"
                      }`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      onClick={() =>
                        item.overlay && setActiveOverlay(item.overlay)
                      }
                      className={`menu-label ${isSelected ? "menu-selected" : ""} block px-5 py-1.5 text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all duration-200 hover:outline-none focus:outline-none text-left cursor-pointer ${
                        isSelected
                          ? "bg-yellow text-background"
                          : "text-muted hover:bg-yellow/10 hover:text-yellow"
                      }`}
                    >
                      {item.label}
                    </button>
                  )}
                </span>
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

      {activeOverlay === "projects" && (
        <TerminalOverlay
          title="projects.dat"
          onClose={() => setActiveOverlay(null)}
        >
          <Projects />
        </TerminalOverlay>
      )}
      {activeOverlay === "skills" && (
        <TerminalOverlay
          title="skills.dat"
          onClose={() => setActiveOverlay(null)}
        >
          <Skills />
        </TerminalOverlay>
      )}
      {activeOverlay === "resume" &&
        (() => {
          openResume();
          return null;
        })()}
    </div>
  );
}
