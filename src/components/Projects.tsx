type ProjectKind = "Mobile" | "Web" | "CLI";

interface Project {
  id: string;
  title: string;
  kind: ProjectKind;
  stack: string;
  description: string;
  url: string;
  demoUrl?: string;
  tags: string[];
}

const projects: Project[] = [
  {
    id: "01",
    title: "LFGuild",
    kind: "Mobile",
    stack: "Swift / UIKit",
    description:
      "Guild discovery for World of Warcraft players. Matches players to guilds that fit their playstyle, with real-time chat built on Swift.",
    url: "https://github.com/GeorgeSuarez/LFGuild",
    tags: ["Swift", "iOS", "UIKit", "Xcode"],
  },
  {
    id: "02",
    title: "ReFactor",
    kind: "Web",
    stack: "React / .NET / SQL",
    description:
      "A developer-themed store for dev gear. Full-stack eCommerce with cart, checkout, and an SQL inventory.",
    url: "https://github.com/GeorgeSuarez/ReFactor",
    tags: ["TypeScript", "C#", ".NET", "Docker", "SQL"],
  },
  {
    id: "03",
    title: "Subby",
    kind: "Mobile",
    stack: "React Native / Expo",
    description:
      "Track and manage subscriptions from one place across iOS and Android, with offline storage via SQLite.",
    url: "https://github.com/GeorgeSuarez/Subby",
    tags: ["React Native", "SQLite", "iOS", "Android", "Expo"],
  },
  {
    id: "04",
    title: "Cheevo Dash",
    kind: "Web",
    stack: "Next.js / React / Tailwind",
    description:
      "A metrics dashboard for Steam achievements. Visualize unlock progress across your entire library.",
    url: "https://github.com/GeorgeSuarez/CheevoDash",
    demoUrl: "https://cheevo-dash.vercel.app",
    tags: ["TypeScript", "NextJS", "ReactJS", "TailWind CSS"],
  },
  {
    id: "05",
    title: "Rusty Vault",
    kind: "CLI",
    stack: "Rust / Ratatui",
    description:
      "A terminal-based credential manager. Passwords and API keys encrypted with AES-256-GCM in a Ratatui TUI.",
    url: "https://github.com/GeorgeSuarez/RustyVault",
    tags: ["Rust", "Ratatui", "SQLite"],
  },
];

const kindStyles: Record<ProjectKind, string> = {
  Mobile: "text-cyan border-cyan/30",
  Web: "text-yellow border-yellow/30",
  CLI: "text-magenta border-magenta/30",
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card group block border border-muted/20 bg-background p-6 text-left hover:border-muted/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--clr-cyan)_12%,transparent)]">
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] tracking-[0.25em] uppercase border px-2 py-0.5 font-semibold ${kindStyles[project.kind]}`}
        >
          {project.kind}
        </span>
        <span className="text-muted/30 text-sm font-bold tracking-widest">
          {project.id}
        </span>
      </div>

      <h2 className="text-yellow text-xl sm:text-2xl font-bold mb-1 tracking-tight">
        {project.title}
      </h2>

      <p className="text-cyan/50 text-xs tracking-wider uppercase mb-3 font-medium">
        {project.stack}
      </p>

      <p className="text-muted text-sm sm:text-base leading-relaxed mb-6">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-cyan/70 tracking-wide uppercase border border-cyan/15 px-2.5 py-1 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-5">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-cyan/60 hover:text-cyan transition-colors font-medium"
        >
          View on GitHub &rarr;
        </a>
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-yellow/60 hover:text-yellow transition-colors font-medium"
          >
            View Demo &rarr;
          </a>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <div className="text-left">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="animate-card-in"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
