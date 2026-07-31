import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-foreground text-7xl sm:text-8xl md:text-9xl font-black tracking-tight mb-2">
        404
      </h1>

      <p className="text-muted text-sm sm:text-base tracking-wide uppercase mb-8">
        Page not found
      </p>

      <Link
        to="/"
        className="inline-block text-foreground text-sm tracking-wider uppercase border border-muted/30 px-5 py-2.5 hover:bg-foreground hover:text-background transition-colors duration-200"
      >
        &larr; Back home
      </Link>
    </div>
  );
}
