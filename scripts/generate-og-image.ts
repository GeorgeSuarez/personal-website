/**
 * Renders tools/og/og-image.html to public/og-image.png with headless Chrome.
 *
 * The template is the source of truth for the social preview card. Run
 * `npm run generate:og` after editing it, and `npm run generate:og:check` to
 * verify the committed PNG exists and is correctly sized. The check only reads
 * the PNG header, so it stays runnable in CI without a browser installed.
 *
 * Chrome is probed at the usual macOS/Linux/Windows locations; set CHROME_PATH
 * to point at another binary.
 *
 * Chrome writes the screenshot but does not always exit afterwards, so this
 * waits for a stable PNG on disk and then kills the browser process group.
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
import { pathToFileURL } from "node:url";

const OG_IMAGE_WIDTH = 1200;

const OG_IMAGE_HEIGHT = 630;

/** Generous ceiling: a healthy render lands in about two seconds. */
const renderTimeoutMilliseconds = 30_000;

const renderPollIntervalMilliseconds = 100;

const repositoryRoot = path.join(import.meta.dirname, "..");

const templatePath = path.join(repositoryRoot, "tools", "og", "og-image.html");

const outputPath = path.join(repositoryRoot, "public", "og-image.png");

/** PNG magic bytes, used to reject non-PNG output without decoding the image. */
const pngSignatureHex = "89504e470d0a1a0a";

const pngHeaderByteLength = 24;

type ImageSize = {
  readonly width: number;
  readonly height: number;
};

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

/** Reads width and height from the PNG IHDR chunk; returns null when the file is not a PNG. */
function readPngSize(filePath: string): ImageSize | null {
  const header = readFileSync(filePath).subarray(0, pngHeaderByteLength);

  if (header.length < pngHeaderByteLength) return null;

  if (header.subarray(0, 8).toString("hex") !== pngSignatureHex) return null;

  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

function relativeOutputPath(): string {
  return path.relative(repositoryRoot, outputPath);
}

/** Verifies the committed PNG exists and matches the Open Graph dimensions in index.html. */
function checkOgImage(): number {
  if (!existsSync(outputPath)) {
    console.error(`Missing ${relativeOutputPath()}. Run: npm run generate:og`);

    return 1;
  }

  const size = readPngSize(outputPath);

  if (size === null) {
    console.error(`${relativeOutputPath()} is not a valid PNG.`);

    return 1;
  }

  if (size.width !== OG_IMAGE_WIDTH || size.height !== OG_IMAGE_HEIGHT) {
    console.error(
      `Expected ${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT} but found ${size.width}x${size.height}.`,
    );

    return 1;
  }

  console.log(`og-image.png is ${size.width}x${size.height}.`);

  return 0;
}

/**
 * Waits for the screenshot to appear, then for its size to stop changing.
 * Chrome writes the PNG in a single pass, so a repeated size means it is complete.
 */
async function waitForStableScreenshot(
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

  return waitForStableScreenshot(filePath, chromeProcess, deadlineMilliseconds, nextPreviousSize);
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

async function renderOgImage(): Promise<number> {
  if (!existsSync(templatePath)) {
    console.error(`Missing template ${path.relative(repositoryRoot, templatePath)}.`);

    return 1;
  }

  const chrome = findChrome();

  if (chrome === null) {
    console.error("No Chrome or Chromium found. Set CHROME_PATH to a browser binary and retry.");

    return 1;
  }

  // A throwaway profile keeps the render out of the user's real browser session.
  const workDirectory = mkdtempSync(path.join(tmpdir(), "og-image-"));
  const userDataDirectory = path.join(workDirectory, "profile");
  const logPath = path.join(workDirectory, "chrome.log");

  mkdirSync(userDataDirectory);

  const logFileDescriptor = openSync(logPath, "w");

  rmSync(outputPath, { force: true });

  const chromeProcess = spawn(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--force-device-scale-factor=1",
      `--user-data-dir=${userDataDirectory}`,
      `--window-size=${OG_IMAGE_WIDTH},${OG_IMAGE_HEIGHT}`,
      // Waits for the Google Fonts stylesheet so the card never renders in a fallback face.
      "--virtual-time-budget=8000",
      `--screenshot=${outputPath}`,
      pathToFileURL(templatePath).href,
    ],
    // detached makes the child a process-group leader, so helpers die with it.
    { detached: true, stdio: ["ignore", "ignore", logFileDescriptor] },
  );

  let rendered = false;

  try {
    rendered = await waitForStableScreenshot(
      outputPath,
      chromeProcess,
      Date.now() + renderTimeoutMilliseconds,
      -1,
    );

    if (!rendered) {
      console.error("Chrome did not produce a screenshot in time.");
      printChromeLogTail(logPath);
    }
  } finally {
    terminateProcessTree(chromeProcess);
    closeSync(logFileDescriptor);
    rmSync(workDirectory, { recursive: true, force: true });
  }

  if (!rendered) return 1;

  return checkOgImage();
}

process.exitCode = process.argv.includes("--check") ? checkOgImage() : await renderOgImage();
