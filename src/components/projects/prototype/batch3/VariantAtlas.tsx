import { useState } from "react";
import { iconFor, projects, type ProjectKind } from "../../../../data/projects";
import { useTheme } from "../../../../theme/useTheme";
import { projectCollections, projectsInCollection } from "./projectCollections";

const kindText: Record<ProjectKind, string> = {
  Mobile: "text-cyan",
  Web: "text-yellow",
  CLI: "text-magenta",
  "Game Add-on": "text-cyan",
};

/** Batch 3, variant G — Atlas: see the portfolio by problem domain, then focus a project. */
export default function VariantAtlas() {
  const [activeTitle, setActiveTitle] = useState(projects[0]?.title ?? "");
  const { theme } = useTheme();
  const isLedger = theme === "ledger";
  const activeProject = projects.find((project) => project.title === activeTitle) ?? projects[0];

  if (!activeProject) return null;

  return (
    <div className="pv3 pv3-atlas">
      <header className="pv3-head pv3-atlas-head">
        <div>
          <p className="pv3-kicker pv3-font-mono">Portfolio map</p>
          <h2 className="pv3-heading pv3-font-display">A map of the work</h2>
          <p className="pv3-intro">
            Different problems, connected by the things people need to do.
          </p>
        </div>
        <p className="pv3-total pv3-font-mono">{projects.length} projects / 4 territories</p>
      </header>

      <div className="pv3-atlas-map" role="group" aria-label="Projects grouped by purpose">
        {projectCollections.map((collection) => (
          <section className="pv3-atlas-region" data-region={collection.key} key={collection.key}>
            <div className="pv3-atlas-region-head">
              <span className="pv3-atlas-anchor" aria-hidden="true" />
              <div>
                <h3 className="pv3-atlas-region-title">{collection.title}</h3>
                <p className="pv3-atlas-region-description">{collection.description}</p>
              </div>
            </div>

            <div className="pv3-atlas-nodes">
              {projectsInCollection(collection).map((project) => (
                <button
                  type="button"
                  className="pv3-atlas-node"
                  key={project.title}
                  aria-pressed={activeProject.title === project.title}
                  onClick={() => setActiveTitle(project.title)}
                >
                  <span className={`pv3-atlas-node-kind ${kindText[project.kind]}`}>
                    {project.kind}
                  </span>
                  <span className="pv3-atlas-node-title">{project.title}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <article className="pv3-atlas-detail" aria-live="polite">
        <div className="pv3-atlas-detail-main">
          <span className={`pv3-atlas-detail-kind ${kindText[activeProject.kind]}`}>
            {activeProject.kind}
          </span>
          <h3 className="pv3-atlas-detail-title pv3-font-display">{activeProject.title}</h3>
          <p className="pv3-atlas-detail-copy">{activeProject.description}</p>
          <p className="pv3-atlas-detail-stack pv3-font-mono">{activeProject.stack}</p>
          <div className="pv3-atlas-icons" aria-hidden="true">
            {activeProject.icons.map((icon) => {
              const { src, invert } = iconFor(icon, isLedger);

              return (
                <img
                  key={icon}
                  src={src}
                  alt=""
                  className={invert ? "icon-invert" : undefined}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="pv3-atlas-actions">
          <a href={activeProject.url} target="_blank" rel="noopener noreferrer">
            View source
          </a>
          {activeProject.demoUrl && (
            <a href={activeProject.demoUrl} target="_blank" rel="noopener noreferrer">
              Open live demo
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
