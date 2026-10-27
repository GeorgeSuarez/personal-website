import { PROJECTS, type Project, type ProjectKind } from "../../../../data/projects";

const kindText: Record<ProjectKind, string> = {
  Mobile: "text-cyan",
  Web: "text-yellow",
  CLI: "text-magenta",
  "Game Add-on": "text-cyan",
};

const tileLayouts = {
  Vigil: "pv3-sheet-tile--large",
  ReFactor: "pv3-sheet-tile--wide",
  Subby: "pv3-sheet-tile--tall",
  Rarify: "pv3-sheet-tile--medium",
  TrailFinder: "pv3-sheet-tile--medium",
  LFGuild: "pv3-sheet-tile--medium",
  "ArcGIS Migrate": "pv3-sheet-tile--terminal",
  TrickOrRoute: "pv3-sheet-tile--route",
  "Rusty Vault": "pv3-sheet-tile--terminal-small",
} satisfies Record<string, string>;

function tileLayoutForProject(title: string): string {
  return Object.entries(tileLayouts).find(([projectTitle]) => projectTitle === title)?.[1] ?? "";
}

function ProjectArtwork({ project }: { readonly project: Project }) {
  if (project.media) {
    return (
      <img
        className="pv3-sheet-image"
        src={project.media.src}
        alt={project.media.alt}
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (project.title === "ArcGIS Migrate") {
    return (
      <div
        className="pv3-sheet-art pv3-sheet-art--terminal"
        role="img"
        aria-label="Illustrative ArcGIS migration scan output"
      >
        <span className="pv3-sheet-art-command pv3-font-mono">scan ./src</span>
        <span className="pv3-sheet-art-line">
          <b>error</b> widget-import
        </span>
        <span className="pv3-sheet-art-line">
          <b>warn</b> view.ui.add()
        </span>
        <span className="pv3-sheet-art-foot pv3-font-mono">--fail-on error</span>
      </div>
    );
  }

  if (project.title === "TrickOrRoute") {
    return (
      <div
        className="pv3-sheet-art pv3-sheet-art--route"
        role="img"
        aria-label="Illustrative route across World of Warcraft regions"
      >
        <span className="pv3-sheet-art-foot pv3-font-mono">Hallow's End / 11 phases</span>
        <div className="pv3-route-line" aria-hidden="true">
          <span>Stormwind</span>
          <i />
          <span>Outland</span>
          <i />
          <span>Kalimdor</span>
          <i />
          <span>Khaz Algar</span>
        </div>
        <span className="pv3-sheet-art-caption">A lower-backtracking candy-bucket route</span>
      </div>
    );
  }

  return <div className="pv3-sheet-art pv3-sheet-art--empty">Project preview coming soon</div>;
}

/** Batch 3, variant I — Contact Sheet: browse the real artifacts before the copy. */
export default function VariantContactSheet() {
  return (
    <div className="pv3 pv3-contact-sheet">
      <header className="pv3-head pv3-contact-head">
        <div>
          <p className="pv3-kicker pv3-font-mono">Screens, products, and tools</p>
          <h2 className="pv3-heading pv3-font-display">A closer look at the work</h2>
          <p className="pv3-intro">
            Pick a project to open its live build where available, or go straight to the source.
          </p>
        </div>
        <p className="pv3-total pv3-font-mono">{PROJECTS.length} projects</p>
      </header>

      <div className="pv3-sheet-grid">
        {PROJECTS.map((project) => {
          const primaryUrl = project.demoUrl ?? project.url;
          const primaryLabel = project.demoUrl ? "Live project" : "Project source";

          return (
            <article
              className={`pv3-sheet-tile ${tileLayoutForProject(project.title)}`}
              key={project.title}
            >
              <a
                className="pv3-sheet-artwork"
                href={primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${primaryLabel}: ${project.title}`}
              >
                <ProjectArtwork project={project} />
                <span className="pv3-sheet-caption">
                  <span className={`pv3-sheet-kind ${kindText[project.kind]}`}>{project.kind}</span>
                  <span className="pv3-sheet-title">{project.title}</span>
                </span>
              </a>
              <div className="pv3-sheet-links">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    Open live demo
                  </a>
                )}
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  View source
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
