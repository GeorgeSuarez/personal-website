interface ThemeFabProps {
  onClick: () => void;
}

export default function ThemeFab({ onClick }: ThemeFabProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Change theme"
      className="theme-fab flex md:pointer-fine:hidden fixed z-40 w-14 h-14 rounded-full items-center justify-center shadow-lg cursor-pointer"
      style={{
        background:
          "conic-gradient(from 210deg, #ff0055, #ff8a00, #ffe600, #00e676, #00b0ff, #7c4dff, #ff0055)",
        insetBlockEnd: "calc(1.25rem + env(safe-area-inset-bottom))",
        insetInlineEnd: "1.25rem",
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
