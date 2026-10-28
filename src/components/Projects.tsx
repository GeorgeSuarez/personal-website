import { PROJECTS, iconFor, type Project } from "../data/projects";
import { useTheme } from "../theme/useTheme";

function ProjectCard({ project }: { project: Project }) {
  const { theme } = useTheme();
  const isLedger = theme === "ledger";

  return (
    <article className="project-card flex h-full flex-col overflow-hidden border border-muted/20 bg-background text-start">
      {project.media && (
        <div className="project-shot">
          <img
            src={project.media.src}
            alt={project.media.alt}
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
            className="project-shot__image"
          />
          {project.media.note && <span className="project-shot__note">{project.media.note}</span>}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
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
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <div className="text-start">
      <div className="project-grid">
        {PROJECTS.map((project) => (
          <div key={project.title} className="animate-card-in">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
