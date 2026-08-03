import { useState, useEffect } from "react";
import Projects from "./Projects";

interface MenuItem {
  label: string;
  href: string;
  external: boolean;
  action?: "projects";
}

const menuItems: MenuItem[] = [
  { label: "Projects", href: "#", external: false, action: "projects" },
  {
    label: "Resume",
    href: "https://docs.google.com/document/d/1UhSLU710_8HHWU7tvZG9tbA83dd_0L8IwUvfGo5BnXI/export?format=pdf",
    external: true,
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activateItem = (item: MenuItem) => {
    if (item.external) {
      if (item.href.startsWith("mailto:")) {
        window.location.href = item.href;
      } else {
        window.open(item.href, "_blank", "noopener,noreferrer");
      }
    } else if (item.action === "projects") {
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [selectedIndex]);

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
                        onClick={() => activateItem(item)}
                        className={`menu-label ${isSelected ? "menu-selected" : ""} block px-5 py-1.5 text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all duration-200 hover:outline-none focus:outline-none text-left cursor-pointer whitespace-nowrap ${
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
      </div>

      <section
        id="projects"
        className="px-6 sm:px-10 md:px-12 pb-20 max-w-6xl mx-auto"
      >
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
