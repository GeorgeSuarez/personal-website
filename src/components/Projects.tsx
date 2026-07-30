interface Project {
  id: string;
  title: string;
  platform: string;
  description: string;
  url: string;
  demoUrl?: string;
  tags: string[];
}

const projects: Project[] = [
  {
    id: "01",
    title: "LFGuild",
    platform: "iOS Application // Swift",
    description:
      "An iOS app that helps players match with guilds that suit their needs. Built with Swift and native iOS frameworks to create a seamless guild discovery and recruitment experience for the popular MMO World of Warcraft.",
    url: "https://github.com/GeorgeSuarez/LFGuild",
    tags: ["Swift", "iOS", "UIKit", "Xcode"],
  },
  {
    id: "02",
    title: "ReFactor",
    platform: "React/.NET // TypeScript & C#",
    description:
      "A developer-themed eCommerce store that sells developer themed gear. Built with React, .NET, and SQL.",
    url: "https://github.com/GeorgeSuarez/ReFactor",
    tags: ["TypeScript", "C#", ".NET", "Docker", "SQL"],
  },

  {
    id: "03",
    title: "Subby",
    platform: "React Native // TypeScript",
    description:
      "An React Native project that lets you track and manage your subscriptions from whatever it may be.",
    url: "https://github.com/GeorgeSuarez/Subby",
    tags: ["React Native", "SQLite", "iOS", "Android", "Expo"],
  },
  {
    id: "04",
    title: "Cheevo Dash",
    platform: "Web App // TypeScript",
    description:
      "A dashboard that displays metrics about your Steam achievements. Built with Next.js, React, Tailwind, and shadcn/UI.",
    url: "https://github.com/GeorgeSuarez/CheevoDash",
    demoUrl: "https://cheevo-dash.vercel.app",
    tags: ["TypeScript", "NextJS", "ReactJS", "TailWind CSS"],
  },
  {
    id: "05",
    title: "Rusty Vault",
    platform: "Rust Crate // Rust",
    description:
      "An TUI application that manages your passwords and api credentials. Built with Rust and Ratatui.",
    url: "https://github.com/GeorgeSuarez/RustyVault",
    tags: ["Rust", "Ratatui", "SQLite"],
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative block border border-cyan/20 bg-background p-8 sm:p-12 text-left hover:border-cyan/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.12)] transition-all duration-300">
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow/40 group-hover:border-yellow transition-colors" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow/40 group-hover:border-yellow transition-colors" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow/40 group-hover:border-yellow transition-colors" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow/40 group-hover:border-yellow transition-colors" />

      <div className="flex items-start justify-between mb-6">
        <span className="text-cyan/40 text-[10px] tracking-[0.3em] uppercase font-mono">
          ID:{project.id}
        </span>
      </div>

      <h2 className="text-yellow text-2xl sm:text-3xl tracking-widest uppercase mb-2 group-hover:text-cyan transition-colors duration-300 font-display">
        {project.title}
      </h2>

      <p className="text-cyan/60 text-xl tracking-[0.2em] uppercase mb-6 font-mono">
        {project.platform}
      </p>

      <p className="text-muted text-lg leading-relaxed mb-8 font-mono">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-[14px] text-cyan/60 tracking-[0.15em] uppercase border border-cyan/15 px-3 py-1 font-bold font-mono"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-cyan/40 hover:text-cyan transition-colors"
        >
          <span className="text-lg tracking-[0.2em] uppercase font-mono">
            View on GitHub &gt;&gt;
          </span>
        </a>
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-yellow/40 hover:text-yellow transition-colors"
          >
            <span className="text-lg tracking-[0.2em] uppercase font-mono">
              View Demo &gt;&gt;
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <div className="text-center">
      <div className="w-16 h-px bg-yellow mb-8 mx-auto opacity-60" />

      <h1
        className="text-yellow text-4xl sm:text-5xl font-black tracking-[0.15em] uppercase mb-4 font-display"
        style={{
          textShadow: "0 0 20px rgba(252, 238, 10, 0.3)",
        }}
      >
        Projects
      </h1>

      <p className="text-cyan/60 text-xl tracking-[0.2em] uppercase mb-16 font-mono">
        Archived builds // {projects.length}{" "}
        {projects.length === 1 ? "entry" : "entries"} found
      </p>

      <div className="space-y-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
