# Batch 3 — “A map of the work”

**Question:** Which project-section structure makes the work easiest to explore?

Three variants are available on the existing `/` route at `?variant=G`, `?variant=H`, and `?variant=I`. The floating switcher and left/right arrow keys also cycle between them. The route is mounted only in development.

## Design plan

- **Subject:** a software engineer’s portfolio with web, mobile, CLI, and game-addon work. Use authentic project descriptions and existing product screenshots where available.
- **Color:** reuse the existing theme tokens; no new palette. Circuit theme reference: background `#0A0A0F`, foreground `#E0E0E0`, muted `#9CA3AF`, cyan `#00F0FF`, yellow `#FCEE0A`, magenta `#FF0055`.
- **Type:** Orbitron for display, Share Tech Mono for technical details, system sans for descriptions.
- **Alignment:** left-aligned copy on shared edges. Project names and actions follow their context, and rows wrap rather than clip on narrow screens.
- **Variants:**
  - **G — Atlas:** an all-at-once domain map; select a project node to inspect its description, stack, and links.
  - **H — Collections:** an editorial set of task-based groups; every description remains visible while scanning.
  - **I — Contact sheet:** a varied image mosaic; real project imagery is the navigation surface, with clearly illustrative visual treatments only where no screenshot exists yet.
- **Principles:** keep the project itself prominent; use category labels as text as well as color; avoid another card grid, expandable table, side index, or horizontal reel.

## Review against earlier batches

The first two batches already explored expandable rows, master/detail, a ruled list, a horizontal reel, technology filters, and an image-led poster. Atlas changes the information architecture to a spatial domain map; Collections groups by user task rather than stack; Contact Sheet makes the existing media—not repeated copy—the primary navigation. These are structural differences, not color-only variations.

Review at desktop and narrow mobile widths before choosing a direction. The ArcGIS migration scan and TrickOrRoute route visuals in the contact sheet are illustrative compositions, not screenshots of the running projects.

## Verdict

Pending user review. Keep one direction (or combine a specific element) and remove the other variants when promoting the design.
