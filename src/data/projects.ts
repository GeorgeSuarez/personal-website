// Effect's official mark from effect.website; devicon has no Effect icon.
import effectMark from "../assets/effect-mark.svg";

const ICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

export interface ProjectMedia {
  readonly src: string;
  readonly alt: string;
  /** Set when the image is a reconstructed preview instead of a captured build. */
  readonly note?: string;
}

export interface Project {
  title: string;
  stack: string;
  icons: string[];
  description: string;
  url: string;
  demoUrl?: string;
  media?: ProjectMedia;
}

export function iconFor(icon: string, isLedger: boolean) {
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

export const PROJECTS: Project[] = [
  {
    title: "Vigil",
    stack: "ArcGIS Maps SDK / React / TypeScript / Calcite",
    icons: ["typescript", "react", "vite", "cloudflare"],
    description:
      "A live natural-hazard map for earthquakes, wildfires, hurricanes, and the ISS. Real-time USGS and NASA feeds with a time slider, shareable deep links, and natural-language map commands.",
    url: "https://github.com/GeorgeSuarez/arcgis-vigil",
    demoUrl: "https://vigil.georgesuarezdev.workers.dev",
    media: {
      src: "/projects/vigil.webp",
      alt: "Vigil's live hazard map showing earthquakes, wildfires, storms, and the ISS layer over North America.",
    },
  },
  {
    title: "ArcGIS Migrate",
    stack: "TypeScript / Node.js / ts-morph",
    icons: ["typescript", "nodejs"],
    description:
      "An AST-based CLI that audits ArcGIS Maps SDK apps for legacy widget APIs ahead of the 6.0 migration. Produces actionable Markdown or JSON reports, with CI failure thresholds.",
    url: "https://github.com/GeorgeSuarez/arcgis-migrate",
    media: {
      src: "/projects/arcgis-migrate.webp",
      alt: "ArcGIS Migrate terminal output listing 27 findings, including 5 errors and an estimated 17.5 hours of migration work.",
    },
  },
  {
    title: "ReFactor",
    stack:
      "React 19 / TypeScript / Redux Toolkit / .NET 10 / EF Core / SQL Server / Stripe / Docker",
    // Card icons are a curated stack subset, not the full language registry.
    // pi-lens-ignore: advisory-registry-subset -- card icons are intentionally curated
    icons: ["typescript", "react", "redux", "dotnetcore", "docker"],
    description:
      "A developer-themed storefront with catalog search and filters, coupons, authenticated checkout and order history, plus admin inventory management. Uses ASP.NET Identity, Stripe test-mode payments, and Docker Compose.",
    url: "https://github.com/GeorgeSuarez/ReFactor",
    media: {
      src: "/projects/refactor.webp",
      alt: "ReFactor catalog with developer-themed boots, snowboards, and gloves, plus brand and product-type filters.",
    },
  },
  {
    title: "Subby",
    stack: "React Native / Expo",
    icons: ["reactnative", "expo", "sqlite", "android"],
    description:
      "Track and manage subscriptions from one place across iOS and Android, with offline storage via SQLite.",
    url: "https://github.com/GeorgeSuarez/Subby",
    demoUrl: "https://georgesuarez.github.io/Subby/demo/",
    media: {
      src: "/projects/subby.webp",
      alt: "Subby's dashboard, add-subscription, and subscriptions screens showing monthly spend and upcoming renewals.",
    },
  },
  {
    title: "Rarify",
    stack: "React 19 / TypeScript / Effect / Cloudflare Workers / D1 / Tailwind",
    icons: ["typescript", "react", "effect", "cloudflare", "sqlite", "tailwindcss"],
    description:
      "A Steam achievement dashboard with Steam sign-in, friend and community comparisons, tracked games, and library trends from daily snapshots. Effect-validated APIs and per-game achievement caching run on Cloudflare Workers and D1.",
    url: "https://github.com/GeorgeSuarez/Rarify",
    demoUrl: "https://rarify.georgejsuarez.com",
    media: {
      src: "/projects/rarify.webp",
      alt: "Rarify landing page with Steam sign-in and achievement cards for Hades, Baldur's Gate 3, and Elden Ring.",
    },
  },
  {
    title: "TrailFinder",
    stack: "Effect / Vite / React",
    icons: ["effect", "vite", "react"],
    description:
      "Find nearby hiking trails, search by location, or drop a pin. Trail data comes from Overpass API; geocoding uses Nominatim.",
    url: "https://github.com/GeorgeSuarez/TrailFinder",
    demoUrl: "https://trailfinder.georgesuarezdev.workers.dev",
    media: {
      src: "/projects/trailfinder.webp",
      alt: "TrailFinder map with hiking routes near Zermatt, a selected trail detail, and a distance-sorted results list.",
    },
  },
  {
    title: "LFGuild",
    stack: "Swift / UIKit",
    icons: ["swift", "xcode"],
    description:
      "Guild discovery for World of Warcraft players. Matches players to guilds that fit their playstyle, with real-time chat built on Swift.",
    url: "https://github.com/GeorgeSuarez/LFGuild",
    media: {
      src: "/projects/lfguild.webp",
      alt: "Two LFGuild iPhone screens: matched World of Warcraft guild cards and the player profile.",
    },
  },
  {
    title: "TrickOrRoute",
    stack: "Lua / World of Warcraft AddOn API",
    icons: ["lua"],
    description:
      "A World of Warcraft addon that guides players through a low-backtracking route to every Hallow's End candy bucket, with shortest-path zone ordering, quest-backed progress, automatic waypoints, and a mini tracker HUD.",
    url: "https://github.com/GeorgeSuarez/TrickOrRoute",
    media: {
      src: "/projects/trickorroute.webp",
      alt: "Interface preview of the TrickOrRoute addon, showing 281 candy buckets across 11 Hallow's End travel phases.",
      note: "Interface preview",
    },
  },
  {
    title: "Rusty Vault",
    stack: "Rust / Ratatui",
    icons: ["rust", "sqlite"],
    description:
      "A terminal-based credential manager. Passwords and API keys encrypted with AES-256-GCM in a Ratatui TUI.",
    url: "https://github.com/GeorgeSuarez/RustyVault",
    media: {
      src: "/projects/rustyvault.webp",
      alt: "Rusty Vault terminal showing the account list, keyboard shortcuts, and master-password controls.",
    },
  },
];
