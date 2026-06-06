import { Link } from "react-router-dom";

interface MenuItem {
  label: string;
  href: string;
  external: boolean;
}

const menuItems: MenuItem[] = [
  { label: "GitHub", href: "https://github.com/georgesuarez", external: true },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/george-suarez",
    external: true,
  },
  { label: "Projects", href: "/projects", external: false },
  {
    label: "Contact Me",
    href: "mailto:georgesuarezdev@gmail.com",
    external: true,
  },
];

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden flex items-center justify-center">
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

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.4)_2px,rgba(0,0,0,0.4)_4px)]" />

      {/* Moving Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="w-full h-[2px] bg-[#00f0ff]/20 shadow-[0_0_10px_rgba(0,240,255,0.5)]"
          style={{
            animation: "scanline 6s linear infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* Decorative Top Line */}
        <div className="w-24 h-[1px] bg-[#fcee0a] mb-8 opacity-60" />

        {/* Name */}
        <h1
          className="text-[#fcee0a] text-4xl sm:text-6xl md:text-7xl font-black tracking-[0.15em] uppercase text-center mb-3"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow: "0 0 20px rgba(252, 238, 10, 0.3)",
            animation: "flicker 4s infinite",
          }}
        >
          George Suarez
        </h1>

        {/* Subtitle */}
        <p
          className="text-[#00f0ff] text-lg sm:text-lg tracking-[0.6em] uppercase mb-16 opacity-80"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          Software Engineer
        </p>

        {/* Menu Container with Frame */}
        <div className="relative p-8 sm:p-12">
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
                    className="text-[#00f0ff] text-xs opacity-50 group-hover:opacity-100 transition-opacity"
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
                    <Link
                      to={item.href}
                      className="block py-1 hover:outline-none focus:outline-none"
                    >
                      {content}
                    </Link>
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
          className="text-[#00f0ff]/40 text-[10px] tracking-[0.4em] uppercase mt-8"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          System Online // v2.0.77
        </p>
      </div>
    </div>
  );
}
