import { useTheme } from "../theme/useTheme";

const ICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

type ProjectKind = "Mobile" | "Web" | "CLI";

function iconFor(icon: string, isLedger: boolean) {
  if (icon === "nextjs") {
    return { src: `${ICON_BASE}nextjs/nextjs-plain.svg`, invert: !isLedger };
  }
  if (icon === "expo") {
    return { src: `${ICON_BASE}expo/expo-original.svg`, invert: !isLedger };
  }
  if (icon === "rust") {
    return { src: `${ICON_BASE}rust/rust-original.svg`, invert: !isLedger };
  }
  return { src: `${ICON_BASE}${icon}/${icon}-original.svg`, invert: false };
}

interface Project {
  id: string;
  title: string;
  kind: ProjectKind;
  stack: string;
  icons: string[];
  description: string;
  url: string;
  demoUrl?: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "LFGuild",
    kind: "Mobile",
    stack: "Swift / UIKit",
    icons: ["swift", "xcode"],
    description:
      "Guild discovery for World of Warcraft players. Matches players to guilds that fit their playstyle, with real-time chat built on Swift.",
    url: "https://github.com/GeorgeSuarez/LFGuild",
  },
  {
    id: "02",
    title: "ReFactor",
    kind: "Web",
    stack: "React / .NET / SQL",
    icons: ["react", "typescript", "dotnetcore", "docker"],
    description:
      "A developer-themed store for dev gear. Full-stack eCommerce with cart, checkout, and an SQL inventory.",
    url: "https://github.com/GeorgeSuarez/ReFactor",
  },
  {
    id: "03",
    title: "Subby",
    kind: "Mobile",
    stack: "React Native / Expo",
    icons: ["reactnative", "expo", "sqlite", "android"],
    description:
      "Track and manage subscriptions from one place across iOS and Android, with offline storage via SQLite.",
    url: "https://github.com/GeorgeSuarez/Subby",
  },
  {
    id: "04",
    title: "Cheevo Dash",
    kind: "Web",
    stack: "Next.js / React / Tailwind",
    icons: ["nextjs", "react", "tailwindcss", "typescript"],
    description:
      "A metrics dashboard for Steam achievements. Visualize unlock progress across your entire library.",
    url: "https://github.com/GeorgeSuarez/CheevoDash",
    demoUrl: "https://cheevo-dash.vercel.app",
  },
  {
    id: "05",
    title: "Rusty Vault",
    kind: "CLI",
    stack: "Rust / Ratatui",
    icons: ["rust", "sqlite"],
    description:
      "A terminal-based credential manager. Passwords and API keys encrypted with AES-256-GCM in a Ratatui TUI.",
    url: "https://github.com/GeorgeSuarez/RustyVault",
  },
];

const kindStyles: Record<ProjectKind, string> = {
  Mobile: "text-cyan border-cyan/30",
  Web: "text-yellow border-yellow/30",
  CLI: "text-magenta border-magenta/30",
};

function ProjectCard({ project }: { project: Project }) {
  const { theme } = useTheme();
  const isLedger = theme === "ledger";

  return (
    <div className="project-card group flex h-[330px] flex-col border border-muted/20 bg-background p-6 text-left hover:border-muted/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--clr-cyan)_12%,transparent)]">
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

      <p className="flex-1 text-muted text-sm sm:text-base leading-relaxed mb-6">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        {project.icons.map((icon) => {
          const { src, invert } = iconFor(icon, isLedger);
          return (
            <img
              key={icon}
              src={src}
              alt={icon}
              className="w-7 h-7 object-contain"
              style={invert ? { filter: "invert(1)" } : undefined}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          );
        })}
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
