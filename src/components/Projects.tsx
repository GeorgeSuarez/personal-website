export default function Projects() {
  return (
    <div className="text-center">
      {/* Header */}
      <div className="w-16 h-[1px] bg-[#fcee0a] mb-8 mx-auto opacity-60" />

      <h1
        className="text-[#fcee0a] text-4xl sm:text-5xl font-black tracking-[0.15em] uppercase mb-4"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          textShadow: "0 0 20px rgba(252, 238, 10, 0.3)",
        }}
      >
        Projects
      </h1>

      <p
        className="text-[#00f0ff]/60 text-xs tracking-[0.4em] uppercase mb-16"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        Archived builds // 1 entry found
      </p>

      {/* Featured Project Card */}
      <a
        href="https://github.com/GeorgeSuarez/LFGuild"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block border border-[#00f0ff]/20 bg-[#0a0a0f] p-8 sm:p-12 text-left hover:border-[#00f0ff]/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.12)] transition-all duration-300"
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#fcee0a]/40 group-hover:border-[#fcee0a] transition-colors" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#fcee0a]/40 group-hover:border-[#fcee0a] transition-colors" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#fcee0a]/40 group-hover:border-[#fcee0a] transition-colors" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#fcee0a]/40 group-hover:border-[#fcee0a] transition-colors" />

        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <span
            className="text-[#00f0ff]/40 text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            ID:01
          </span>
          <span
            className="text-[14px] tracking-[0.2em] uppercase px-3 py-1 border text-[#fcee0a] border-[#fcee0a]/30 bg-[#fcee0a]/5"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            Active
          </span>
        </div>

        {/* Title */}
        <h2
          className="text-[#fcee0a] text-2xl sm:text-3xl tracking-[0.1em] uppercase mb-2 group-hover:text-[#00f0ff] transition-colors duration-300"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          LFGuild
        </h2>

        {/* Platform badge */}
        <p
          className="text-[#00f0ff]/60 text-lg tracking-[0.3em] uppercase mb-6"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          iOS Application // Swift
        </p>

        {/* Description */}
        <p
          className="text-gray-300 text-lg leading-relaxed mb-8"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          An iOS app that helps players match with guilds that suit their
          needs. Built with Swift and native iOS frameworks to create a
          seamless guild discovery and recruitment experience for the popular
          MMO World of Warcraft.
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["Swift", "iOS", "UIKit", "Xcode"].map((tag) => (
            <span
              key={tag}
              className="text-[14px] text-[#00f0ff]/60 tracking-[0.15em] uppercase border border-[#00f0ff]/15 px-3 py-1 font-bold"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* GitHub link indicator */}
        <div className="flex items-center gap-2 text-[#00f0ff]/40 group-hover:text-[#00f0ff] transition-colors">
          <span
            className="text-lg tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            View on GitHub &gt;&gt;
          </span>
        </div>
      </a>
    </div>
  );
}
