export const THEMES = [
  { id: "cyberpunk", label: "Cyberpunk", accent: "#00f0ff" },
  { id: "forge", label: "Forge", accent: "#c85a17" },
  { id: "guild", label: "Guild Hall", accent: "#c9a84c" },
  { id: "achievement", label: "Achievement", accent: "#4a9eff" },
  { id: "ledger", label: "Ledger", accent: "#059669" },
  { id: "merch", label: "Merch", accent: "#ff6b35" },
  { id: "prism", label: "Prism", accent: "#7c4dff" },
] as const;

export type Theme = (typeof THEMES)[number]["id"];
export type ThemeInfo = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "achievement";
export const STORAGE_KEY = "portfolio-theme";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && THEMES.some((t) => t.id === value);
}

export function nextTheme(theme: Theme): Theme {
  const index = THEMES.findIndex((t) => t.id === theme);
  return THEMES[(index + 1) % THEMES.length].id;
}
