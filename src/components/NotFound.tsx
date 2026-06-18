import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10">
        {/* Decorative Top Line */}
        <div className="w-24 h-[1px] bg-[#ff0055] mb-8 mx-auto opacity-60" />

        {/* Error Code */}
        <h1
          className="glitch-text text-[#ff0055] text-6xl sm:text-8xl md:text-9xl font-black tracking-[0.15em] uppercase mb-2"
          data-text="404"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow: "0 0 20px rgba(255, 0, 85, 0.3)",
          }}
        >
          404
        </h1>

        {/* Subtitle */}
        <p
          className="text-[#00f0ff] text-sm sm:text-base tracking-[0.6em] uppercase mb-4 opacity-80"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          Sector Not Found
        </p>

        <p
          className="text-gray-400 text-lg tracking-[0.2em] uppercase mb-12 max-w-md mx-auto"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          The requested data fragment does not exist in this construct.
        </p>

        {/* Decorative Divider */}
        <div className="w-16 h-[1px] bg-[#00f0ff]/30 mb-12 mx-auto" />

        <Link
          to="/"
          className="inline-block text-[#00f0ff] text-lg tracking-[0.4em] uppercase border border-[#00f0ff]/30 px-6 py-3 hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] transition-all duration-300"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          &lt; Return to Mainframe
        </Link>
      </div>
    </div>
  );
}
