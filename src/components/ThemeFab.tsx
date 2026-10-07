import { THEMES } from "../theme/themes";
import { useTheme } from "../theme/useTheme";

interface ThemeFabProps {
  onClick: () => void;
}

export default function ThemeFab({ onClick }: ThemeFabProps) {
  const { theme } = useTheme();
  const activeTheme = THEMES.find((option) => option.id === theme);

  if (activeTheme === undefined) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Change theme. Current theme: ${activeTheme.label}`}
      className="theme-fab"
    >
      <span className="theme-fab__swatch" aria-hidden="true" />
      <span className="theme-fab__copy">
        <span className="theme-fab__caption">Current theme</span>
        <span className="theme-fab__name">{activeTheme.label}</span>
      </span>
      <svg
        className="theme-fab__chevron"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m4 6 4 4 4-4" />
      </svg>
    </button>
  );
}
