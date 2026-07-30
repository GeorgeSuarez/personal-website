import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10">
        <div className="w-24 h-px bg-magenta mb-8 mx-auto opacity-60" />

        <h1
          className="glitch-text text-magenta text-6xl sm:text-8xl md:text-9xl font-black tracking-[0.15em] uppercase mb-2 font-display"
          data-text="404"
          style={{
            textShadow: "0 0 20px rgba(255, 0, 85, 0.3)",
          }}
        >
          404
        </h1>

        <p className="text-cyan text-sm sm:text-base tracking-[0.6em] uppercase mb-4 opacity-80 font-mono">
          Sector Not Found
        </p>

        <p className="text-muted text-lg tracking-[0.2em] uppercase mb-12 max-w-md mx-auto font-mono">
          The requested data fragment does not exist in this construct.
        </p>

        <div className="w-16 h-px bg-cyan/30 mb-12 mx-auto" />

        <Link
          to="/"
          className="inline-block text-cyan text-lg tracking-[0.4em] uppercase border border-cyan/30 px-6 py-3 hover:bg-cyan/10 hover:border-cyan transition-all duration-300 font-mono"
        >
          &lt; Return to Mainframe
        </Link>
      </div>
    </div>
  );
}
