// Effect's official mark from effect.website; devicon has no Effect icon.
import effectMark from "../assets/effect-mark.svg";
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

  if (icon === "effect") {
    return { src: effectMark, invert: !isLedger };
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
    title: "ReFactor",
    kind: "Web",
    stack: "TypeScript / React / .NET / SQL",
    icons: ["typescript", "react", "dotnetcore", "docker"],
    description:
      "A developer-themed store for dev gear. Full-stack eCommerce with cart, checkout, and an SQL inventory.",
    url: "https://github.com/GeorgeSuarez/ReFactor",
  },
  {
    id: "02",
    title: "Subby",
    kind: "Mobile",
    stack: "React Native / Expo",
    icons: ["reactnative", "expo", "sqlite", "android"],
    description:
      "Track and manage subscriptions from one place across iOS and Android, with offline storage via SQLite.",
    url: "https://github.com/GeorgeSuarez/Subby",
    demoUrl: "https://georgesuarez.github.io/Subby/demo/",
  },
  {
    id: "03",
    title: "Rarify",
    kind: "Web",
    stack: "Effect / Vite / React / Tailwind",
    icons: ["effect", "vite", "react", "tailwindcss"],
    description:
      "A metrics dashboard for Steam achievements. Visualize unlock progress across your entire library, and compare stats with your friends on Steam.",
    url: "https://github.com/GeorgeSuarez/Rarify",
    demoUrl: "https://rarify.georgejsuarez.com",
  },
  {
    id: "04",
    title: "TrailFinder",
    kind: "Web",
    stack: "Effect / Vite / React",
    icons: ["effect", "vite", "react"],
    description:
      "Find nearby hiking trails, search by location, or drop a pin. Trail data comes from Overpass API; geocoding uses Nominatim.",
    url: "https://github.com/GeorgeSuarez/TrailFinder",
    demoUrl: "https://trailfinder.georgesuarezdev.workers.dev",
  },
  {
    id: "05",
    title: "LFGuild",
    kind: "Mobile",
    stack: "Swift / UIKit",
    icons: ["swift", "xcode"],
    description:
      "Guild discovery for World of Warcraft players. Matches players to guilds that fit their playstyle, with real-time chat built on Swift.",
    url: "https://github.com/GeorgeSuarez/LFGuild",
  },
  {
    id: "06",
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
    <article className="project-card flex h-full flex-col border border-muted/20 bg-background p-6 text-start">
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] tracking-[0.25em] uppercase border px-2 py-0.5 font-semibold ${kindStyles[project.kind]}`}
        >
          {project.kind}
        </span>
        <span className="text-muted/30 text-sm font-bold tracking-widest">{project.id}</span>
      </div>

      <h2 className="text-yellow text-xl sm:text-2xl font-bold mb-1 tracking-tight">
        {project.title}
      </h2>

      <p className="project-stack text-cyan/50 text-xs tracking-wider uppercase mb-3 font-medium">
        {project.stack}
      </p>

      <p className="project-description flex-1 text-muted text-sm sm:text-base leading-relaxed mb-6">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        {project.icons.map((icon) => {
          const { src, invert } = iconFor(icon, isLedger);

          return (
            <img
              key={icon}
              src={src}
              alt=""
              className={`w-7 h-7 shrink-0 object-contain ${invert ? "icon-invert" : ""}`}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          );
        })}
      </div>

      <div className="project-actions flex flex-wrap items-center gap-x-5 gap-y-2">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link github-link text-sm text-cyan/60 font-medium"
        >
          View on GitHub &rarr;
        </a>
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link demo-link text-sm text-yellow/60 font-medium"
          >
            View Demo &rarr;
          </a>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <div className="text-start">
      <div className="project-grid">
        {projects.map((project) => (
          <div key={project.id} className="animate-card-in">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
