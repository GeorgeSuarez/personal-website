import { type Project, type ProjectKind } from "../../../../data/projects";
import { projectCollections, projectsInCollection } from "./projectCollections";

const kindText: Record<ProjectKind, string> = {
  Mobile: "text-cyan",
  Web: "text-yellow",
  CLI: "text-magenta",
  "Game Add-on": "text-cyan",
};

function ProjectLinks({ project }: { readonly project: Project }) {
  return (
    <div className="pv3-collection-links">
      <a href={project.url} target="_blank" rel="noopener noreferrer">
        Source
      </a>
      {project.demoUrl && (
        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
          Live demo
        </a>
      )}
    </div>
  );
}

/** Batch 3, variant H — Collections: tell the story by the work each project does. */
export default function VariantCollections() {
  return (
    <div className="pv3 pv3-collections">
      <header className="pv3-head pv3-collections-head">
        <div>
          <p className="pv3-kicker pv3-font-mono">Selected work</p>
          <h2 className="pv3-heading pv3-font-display">Built for real pursuits</h2>
          <p className="pv3-intro">
            A few different kinds of problems, from finding a trail to building a tool.
          </p>
        </div>
        <a
          className="pv3-github-link"
          href="https://github.com/GeorgeSuarez"
          target="_blank"
          rel="noopener noreferrer"
        >
          Browse all repositories
        </a>
      </header>

      <div className="pv3-collection-list">
        {projectCollections.map((collection) => (
          <section
            className="pv3-collection"
            key={collection.key}
            aria-labelledby={`pv3-collection-title-${collection.key}`}
          >
            <div className="pv3-collection-intro">
              <span className="pv3-collection-mark" aria-hidden="true" />
              <div>
                <h3 id={`pv3-collection-title-${collection.key}`} className="pv3-collection-title">
                  {collection.title}
                </h3>
                <p>{collection.description}</p>
              </div>
            </div>

            <div className="pv3-collection-projects">
              {projectsInCollection(collection).map((project) => (
                <article className="pv3-collection-project" key={project.title}>
                  <div className="pv3-collection-project-title">
                    <span className={`pv3-collection-kind ${kindText[project.kind]}`}>
                      {project.kind}
                    </span>
                    <h4>{project.title}</h4>
                  </div>
                  <div className="pv3-collection-project-copy">
                    <p>{project.description}</p>
                    <p className="pv3-collection-stack pv3-font-mono">{project.stack}</p>
                  </div>
                  <ProjectLinks project={project} />
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
