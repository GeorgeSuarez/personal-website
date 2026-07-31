import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const COMMAND = "./init_portfolio.sh";
const TYPING_SPEED = 80;
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

  useEffect(() => {
    if (displayedCommand.length < COMMAND.length) {
      const timeout = setTimeout(() => {
        setDisplayedCommand(COMMAND.slice(0, displayedCommand.length + 1));
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setShowOutput(true);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [displayedCommand]);

  useEffect(() => {
    if (displayedCommand.length === COMMAND.length && !isFadingOut) {
      const interval = setInterval(() => {
        setCursorVisible((prev) => !prev);
      }, 530);
      return () => clearInterval(interval);
    }
  }, [displayedCommand, isFadingOut]);

  useEffect(() => {
    if (!showOutput) return;

    if (outputIndex < OUTPUT_LINES.length) {
      const timeout = setTimeout(() => {
        setOutputIndex((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIsComplete(true);
        setIsFadingOut(true);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [showOutput, outputIndex]);

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
      className={`fixed inset-0 z-50 bg-background flex items-center justify-center p-4 transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="relative border border-cyan/30 bg-background/95 backdrop-blur-sm shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyan/20 bg-background/50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-magenta/80" />
              <span className="w-3 h-3 rounded-full bg-yellow/80" />
              <span className="w-3 h-3 rounded-full bg-cyan/80" />
            </div>
            <span className="text-cyan/60 text-[10px] tracking-[0.3em] uppercase font-mono">
              boot_sequence.exe
            </span>
            <div className="w-[52px]" />
          </div>

          <div className="p-6 sm:p-8 min-h-[300px]">
            <div className="mb-4 space-y-1">
              <p className="text-cyan/30 text-xs font-mono">
                BIOS v4.2.77 initialized
              </p>
              <p className="text-cyan/30 text-xs font-mono">
                Memory check: 64TB OK
              </p>
              <p className="text-cyan/30 text-xs font-mono">
                Neural interface detected
              </p>
            </div>

            <div className="flex items-start gap-2 mb-4">
              <span className="text-cyan text-sm font-mono">
                root@netrunner:~$
              </span>
              <span className="text-foreground text-sm font-mono">
                {displayedCommand}
                {!isComplete && (
                  <span
                    className={`inline-block w-2 h-4 ml-0.5 align-middle bg-cyan ${
                      cursorVisible ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </span>
            </div>

            {showOutput && (
              <div className="space-y-2 pl-0">
                {OUTPUT_LINES.slice(0, outputIndex).map((line, index) => (
                  <p
                    key={index}
                    className={`text-sm animate-fade-in ${
                      index === OUTPUT_LINES.length - 1
                        ? "text-yellow"
                        : "text-cyan/70"
                    } font-mono`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}

            {isComplete && (
              <div className="mt-6">
                <div className="w-full h-px bg-cyan/10 overflow-hidden">
                  <div
                    className="h-full bg-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                    style={{
                      animation: "progress-fill 0.5s ease-out forwards",
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
