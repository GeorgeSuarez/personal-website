/**
 * Shared headless-Chrome rendering used by the asset generators.
 *
 * Chrome writes its output file but does not always exit afterwards, so every
 * render waits for a stable file on disk and then kills the browser process
 * group. Callers validate the produced file themselves.
 *
 * Chrome is probed at the usual macOS/Linux/Windows locations; set CHROME_PATH
 * to point at another binary.
 */
import { spawn, type ChildProcess } from "node:child_process";
import {
  closeSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

/** Generous ceiling: a healthy render lands in about two seconds. */
const renderTimeoutMilliseconds = 30_000;

const renderPollIntervalMilliseconds = 100;

const chromeCandidates: ReadonlyArray<string> = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/snap/bin/chromium",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

export type ChromeRenderRequest = {
  /** Output name used in messages, e.g. `og-image.png`. */
  readonly label: string;
  /** Absolute path Chrome should write, and that this waits for. */
  readonly outputPath: string;
  /** Absolute file URL Chrome should load. */
  readonly target: string;
  /** Flags specific to this render; the shared flags are added here. */
  readonly chromeArgs: ReadonlyArray<string>;
};

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function findChrome(): string | null {
  const override = process.env.CHROME_PATH;

  if (override !== undefined && override.length > 0) {
    if (existsSync(override)) return override;

    console.error(`CHROME_PATH points at "${override}", but nothing exists there.`);

    return null;
  }

  for (const candidate of chromeCandidates) {
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

/**
 * Wait for a file to appear and stop changing. Chrome writes in a single pass,
 * so a repeated size means the encoder is done.
 */
async function waitForStableFile(
  filePath: string,
  chromeProcess: ChildProcess,
  deadlineMilliseconds: number,
  previousSize: number,
): Promise<boolean> {
  if (Date.now() >= deadlineMilliseconds) return false;

  // Chrome only exits on its own when it fails early; the deadline covers the rest.
  if (chromeProcess.exitCode !== null || chromeProcess.signalCode !== null) return false;

  let nextPreviousSize = previousSize;

  if (existsSync(filePath)) {
    const size = statSync(filePath).size;

    if (size > 0 && size === previousSize) return true;

    nextPreviousSize = size;
  }

  await delay(renderPollIntervalMilliseconds);

  return waitForStableFile(filePath, chromeProcess, deadlineMilliseconds, nextPreviousSize);
}

/** Chrome spawns helper processes, so take down the whole group we created. */
function terminateProcessTree(chromeProcess: ChildProcess): void {
  if (chromeProcess.pid === undefined) return;

  try {
    process.kill(-chromeProcess.pid, "SIGKILL");
  } catch {
    /* the group is already gone */
  }

  try {
    chromeProcess.kill("SIGKILL");
  } catch {
    /* the process is already gone */
  }
}

function printChromeLogTail(logPath: string): void {
  const lines = readFileSync(logPath, "utf8").split("\n");
  const tail = lines.slice(-14);

  console.error("Chrome output:");

  for (const line of tail) {
    if (line.trim() === "") continue;

    console.error(`  ${line}`);
  }
}

/**
 * Render `request.target` to `request.outputPath` with headless Chrome.
 *
 * @returns `true` when Chrome produced a non-empty, size-stable file.
 */
export async function renderWithChrome(request: ChromeRenderRequest): Promise<boolean> {
  const chrome = findChrome();

  if (chrome === null) {
    console.error("No Chrome or Chromium found. Set CHROME_PATH to a browser binary and retry.");

    return false;
  }

  // A throwaway profile keeps the render out of the user's real browser session.
  const workDirectory = mkdtempSync(path.join(tmpdir(), "chrome-render-"));
  const userDataDirectory = path.join(workDirectory, "profile");
  const logPath = path.join(workDirectory, "chrome.log");

  mkdirSync(userDataDirectory);

  const logFileDescriptor = openSync(logPath, "w");

  rmSync(request.outputPath, { force: true });

  const chromeProcess = spawn(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${userDataDirectory}`,
      // Waits for stylesheets and fonts so output never renders in a fallback face.
      "--virtual-time-budget=8000",
      ...request.chromeArgs,
      request.target,
    ],
    // detached makes the child a process-group leader, so helpers die with it.
    { detached: true, stdio: ["ignore", "ignore", logFileDescriptor] },
  );

  let rendered = false;

  try {
    rendered = await waitForStableFile(
      request.outputPath,
      chromeProcess,
      Date.now() + renderTimeoutMilliseconds,
      -1,
    );

    if (!rendered) {
      console.error(`Chrome did not produce ${request.label} in time.`);
      printChromeLogTail(logPath);
    }
  } finally {
    terminateProcessTree(chromeProcess);
    closeSync(logFileDescriptor);
    rmSync(workDirectory, { recursive: true, force: true });
  }

  return rendered;
}
