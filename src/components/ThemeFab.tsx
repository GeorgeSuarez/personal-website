import { useTheme } from "../theme/useTheme";

export default function ThemeFab() {
  const { openSelector } = useTheme();

  return (
    <button
      onClick={openSelector}
      aria-label="Change theme"
      className="flex md:pointer-fine:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full items-center justify-center shadow-lg transition-transform duration-200 active:scale-90 hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      style={{
        background: "conic-gradient(from 210deg, #ff0055, #ff8a00, #ffe600, #00e676, #00b0ff, #7c4dff, #ff0055)",
        bottom: "calc(1.25rem + env(safe-area-inset-bottom))",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.35)",
      }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0d0015"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22a10 10 0 1 1 10-10" />
        <circle cx="12" cy="12" r="10" />
        <circle cx="7.5" cy="10.5" r="1.2" fill="#0d0015" stroke="none" />
        <circle cx="12" cy="7" r="1.2" fill="#0d0015" stroke="none" />
        <circle cx="16.5" cy="10.5" r="1.2" fill="#0d0015" stroke="none" />
        <circle cx="14.5" cy="15" r="1.2" fill="#0d0015" stroke="none" />
      </svg>
    </button>
  );
}
