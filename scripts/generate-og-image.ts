/**
 * Renders tools/og/og-image.html to public/og-image.png with headless Chrome.
 *
 * The template is the source of truth for the social preview card. Run
 * `npm run generate:og` after editing it, and `npm run generate:og:check` to
 * verify the committed PNG exists and is correctly sized. The check only reads
 * the PNG header, so it stays runnable in CI without a browser installed.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { renderWithChrome } from "./chrome-render.ts";

const OG_IMAGE_WIDTH = 1200;

const OG_IMAGE_HEIGHT = 630;

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

async function renderOgImage(): Promise<number> {
  if (!existsSync(templatePath)) {
    console.error(`Missing template ${path.relative(repositoryRoot, templatePath)}.`);

    return 1;
  }

  const rendered = await renderWithChrome({
    label: "og-image.png",
    outputPath,
    target: pathToFileURL(templatePath).href,
    chromeArgs: [
      "--force-device-scale-factor=1",
      `--window-size=${OG_IMAGE_WIDTH},${OG_IMAGE_HEIGHT}`,
      `--screenshot=${outputPath}`,
    ],
  });

  if (!rendered) return 1;

  return checkOgImage();
}

process.exitCode = process.argv.includes("--check") ? checkOgImage() : await renderOgImage();
