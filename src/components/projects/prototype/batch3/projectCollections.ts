// Prototype helper: the portfolio app is a single package, so this deep relative
// import is intentional.
// pi-lens-ignore: no-relative-cross-package-import -- prototype-only helper
import { PROJECTS, type Project } from "../../../../data/projects.ts";

export interface ProjectCollection {
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly projectTitles: readonly string[];
}

/** Projects grouped by the problem they help people solve. */
export const projectCollections: readonly ProjectCollection[] = [
  {
    key: "explore",
    title: "Find your way",
    description: "Maps and trails that make a place easier to understand.",
    projectTitles: ["Vigil", "TrailFinder"],
  },
  {
    key: "build",
    title: "Make everyday systems",
    description: "Useful products for buying, tracking, and staying organized.",
    projectTitles: ["ReFactor", "Subby"],
  },
  {
    key: "play",
    title: "Go deeper into play",
    description: "Tools for exploring games and finding people to play with.",
    projectTitles: ["Rarify", "LFGuild", "TrickOrRoute"],
  },
  {
    key: "tools",
    title: "Build the tools",
    description: "Focused utilities for codebases and the command line.",
    projectTitles: ["arcgis-migrate", "Rusty Vault"],
  },
];

/** Returns the projects assigned to a collection, preserving its editorial order. */
export function projectsInCollection(collection: ProjectCollection): Project[] {
  return collection.projectTitles.flatMap((title) => {
    const project = PROJECTS.find((candidate) => candidate.title === title);

    return project ? [project] : [];
  });
}
