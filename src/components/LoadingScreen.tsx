import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const COMMAND = "./init_portfolio.sh";
const TYPING_SPEED = 80; // ms per character
const OUTPUT_LINES = [
  "> Initializing neural link...",
  "> Loading protocols...",
  "> Establishing secure connection...",
  "> Synchronizing with mainframe...",
  "> Access granted. Welcome, Netrunner.",
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [displayedCommand, setDisplayedCommand] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showOutput, setShowOutput] = useState(false);
  const [outputIndex, setOutputIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Typing animation
  useEffect(() => {
    if (displayedCommand.length < COMMAND.length) {
      const timeout = setTimeout(() => {
        setDisplayedCommand(COMMAND.slice(0, displayedCommand.length + 1));
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    } else {
      // Command fully typed - wait then show output
      const timeout = setTimeout(() => {
        setShowOutput(true);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [displayedCommand]);

  // Cursor blink when not typing
  useEffect(() => {
    if (displayedCommand.length === COMMAND.length && !isFadingOut) {
      const interval = setInterval(() => {
        setCursorVisible((prev) => !prev);
      }, 530);
      return () => clearInterval(interval);
    }
  }, [displayedCommand, isFadingOut]);

  // Output lines animation
  useEffect(() => {
    if (!showOutput) return;

    if (outputIndex < OUTPUT_LINES.length) {
      const timeout = setTimeout(() => {
        setOutputIndex((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      // All output shown - start fade out
      const timeout = setTimeout(() => {
        setIsComplete(true);
        setIsFadingOut(true);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [showOutput, outputIndex]);

  // Fade out complete - trigger onComplete
  useEffect(() => {
    if (isFadingOut) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [isFadingOut, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0a0a0f] flex items-center justify-center p-4 transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Terminal Window */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="relative border border-[#00f0ff]/30 bg-[#0a0a0f]/95 backdrop-blur-sm shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          {/* Corner decorations */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#fcee0a]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#fcee0a]" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#fcee0a]" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#fcee0a]" />

          {/* Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#00f0ff]/20 bg-[#0a0a0f]/50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff0055]/80" />
              <span className="w-3 h-3 rounded-full bg-[#fcee0a]/80" />
              <span className="w-3 h-3 rounded-full bg-[#00f0ff]/80" />
            </div>
            <span
              className="text-[#00f0ff]/60 text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              boot_sequence.exe
            </span>
            <div className="w-[52px]" />
          </div>

          {/* Terminal Content */}
          <div className="p-6 sm:p-8 min-h-[300px]">
            {/* Previous boot messages */}
            <div className="mb-4 space-y-1">
              <p
                className="text-[#00f0ff]/30 text-xs"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                BIOS v4.2.77 initialized
              </p>
              <p
                className="text-[#00f0ff]/30 text-xs"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                Memory check: 64TB OK
              </p>
              <p
                className="text-[#00f0ff]/30 text-xs"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                Neural interface detected
              </p>
            </div>

            {/* Command line */}
            <div className="flex items-start gap-2 mb-4">
              <span
                className="text-[#00f0ff] text-sm"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                root@netrunner:~$
              </span>
              <span
                className="text-gray-200 text-sm"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                {displayedCommand}
                {!isComplete && (
                  <span
                    className={`inline-block w-2 h-4 ml-0.5 align-middle bg-[#00f0ff] ${
                      cursorVisible ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </span>
            </div>

            {/* Output lines */}
            {showOutput && (
              <div className="space-y-2 pl-0">
                {OUTPUT_LINES.slice(0, outputIndex).map((line, index) => (
                  <p
                    key={index}
                    className={`text-sm ${
                      index === OUTPUT_LINES.length - 1
                        ? "text-[#fcee0a]"
                        : "text-[#00f0ff]/70"
                    }`}
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      animation: "fadeIn 0.3s ease-out",
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}

            {/* Progress bar when complete */}
            {isComplete && (
              <div className="mt-6">
                <div className="w-full h-[2px] bg-[#00f0ff]/10 overflow-hidden">
                  <div
                    className="h-full bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                    style={{
                      animation: "progressFill 0.5s ease-out forwards",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
