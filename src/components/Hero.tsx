import { useState, useEffect } from "react";
import TerminalOverlay from "./TerminalOverlay";
import Projects from "./Projects";
import Skills from "./Skills";
import Resume from "./Resume";

interface MenuItem {
  label: string;
  href: string;
  external: boolean;
  overlay?: "projects" | "skills" | "resume";
}

const menuItems: MenuItem[] = [
  { label: "GitHub", href: "https://github.com/georgesuarez", external: true },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/george-suarez",
    external: true,
  },
  { label: "Projects", href: "#", external: false, overlay: "projects" },
  { label: "Skills", href: "#", external: false, overlay: "skills" },
  { label: "Resume", href: "#", external: false, overlay: "resume" },
  {
    label: "Contact Me",
    href: "mailto:georgesuarezdev@gmail.com",
    external: true,
  },
];

export default function Hero() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<
    null | "projects" | "skills" | "resume"
  >(null);

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 1000);
    };

    triggerGlitch();
    const interval = setInterval(triggerGlitch, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden flex items-center justify-center p-4 sm:p-8">
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0f_80%)] pointer-events-none" />

      {/* Terminal Window */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* Terminal Frame */}
        <div className="relative border border-[#00f0ff]/30 bg-[#0a0a0f]/90 backdrop-blur-sm shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          {/* Corner decorations */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#fcee0a]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#fcee0a]" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#fcee0a]" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#fcee0a]" />

          {/* Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#00f0ff]/20 bg-[#0a0a0f]/50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff0055]/80" />
              <span className="w-3 h-3 rounded-full bg-[#fcee0a]/80" />
              <span className="w-3 h-3 rounded-full bg-[#00f0ff]/80" />
            </div>
            <span
              className="text-[#00f0ff]/60 text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              root@netrunner:~$
            </span>
            <div className="w-[52px]" />
          </div>

          {/* Terminal Content */}
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            {/* Prompt Line */}
            <div className="w-full flex items-center gap-2 mb-8 text-left">
              <span
                className="text-[#00f0ff] text-xs"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                $
              </span>
              <span
                className="text-[#00f0ff]/40 text-xs tracking-wider"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                ./init_portfolio.sh
              </span>
            </div>

            {/* Decorative Top Line */}
            <div className="w-24 h-[1px] bg-[#fcee0a] mb-8 opacity-60" />

            {/* Name */}
            <h1
              className={`glitch-text text-[#fcee0a] text-4xl sm:text-6xl md:text-7xl font-black tracking-[0.15em] uppercase text-center mb-3 ${isGlitching ? "glitching" : ""}`}
              data-text="George Suarez"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                textShadow: "0 0 20px rgba(252, 238, 10, 0.3)",
              }}
            >
              George Suarez
              <span className="glitch-layer" aria-hidden="true" />
              {isGlitching && (
                <span className="glitch-scanline" aria-hidden="true" />
              )}
            </h1>

            {/* Subtitle */}
            <p
              className="text-[#00f0ff] text-lg sm:text-lg tracking-[0.6em] uppercase mb-16 opacity-80"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              Software Engineer
            </p>

            {/* Menu Container with Frame */}
            <div className="relative p-8 sm:p-12 w-full max-w-md">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#fcee0a]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#fcee0a]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#fcee0a]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#fcee0a]" />

              <nav className="flex flex-col gap-5 sm:gap-6 items-start">
                {menuItems.map((item, index) => {
                  const content = (
                    <span className="group flex items-center gap-4 transition-all duration-300">
                      <span
                        className="text-[#00f0ff] text-lg opacity-50 group-hover:opacity-100 transition-opacity"
                        style={{ fontFamily: "'Share Tech Mono', monospace" }}
                      >
                        0{index + 1}
                      </span>
                      <span className="text-gray-300 text-lg sm:text-xl tracking-[0.2em] uppercase group-hover:text-[#fcee0a] group-hover:translate-x-2 transition-all duration-300">
                        {item.label}
                      </span>
                      <span className="h-[1px] w-0 bg-[#fcee0a] group-hover:w-12 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    </span>
                  );

                  return (
                    <div key={item.label} className="relative">
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block py-1 hover:outline-none focus:outline-none"
                        >
                          {content}
                        </a>
                      ) : (
                        <button
                          onClick={() =>
                            item.overlay && setActiveOverlay(item.overlay)
                          }
                          className="block py-1 hover:outline-none focus:outline-none text-left cursor-pointer"
                        >
                          {content}
                        </button>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Decorative Bottom Line */}
            <div className="w-24 h-[1px] bg-[#fcee0a] mt-12 opacity-60" />

            {/* Status Text */}
            <p
              className="text-[#00f0ff]/40 text-[16px] tracking-[0.4em] uppercase mt-8"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              System Online // v2.0.77
            </p>

            {/* Prompt Line */}
            <div className="w-full flex items-center gap-2 mt-8 text-left">
              <span
                className="text-[#00f0ff] text-xs"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                $
              </span>
              <span
                className="text-[#00f0ff]/40 text-xs tracking-wider"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                <span className="animate-pulse">_</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
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
      {activeOverlay === "resume" && (
        <TerminalOverlay
          title="resume.dat"
          onClose={() => setActiveOverlay(null)}
        >
          <Resume />
        </TerminalOverlay>
      )}
    </div>
  );
}
