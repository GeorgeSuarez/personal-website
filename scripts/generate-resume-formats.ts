/**
 * Regenerates the TXT, Markdown, and HTML resume variants from the DOCX source of truth.
 *
 * The DOCX at public/George_Suarez_Resume.docx is the canonical resume. Run
 * `npm run generate:resume` after replacing it, and `npm run generate:resume:check`
 * to fail when the generated variants no longer match it.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { format } from "oxfmt";

const repositoryRoot = path.join(import.meta.dirname, "..");

const docxPath = path.join(repositoryRoot, "public", "George_Suarez_Resume.docx");

const outputDirectory = path.join(repositoryRoot, "public");

const outputBaseName = "George_Suarez_Resume";

type ContactPart = {
  readonly text: string;
  readonly href: string | null;
};

type SkillGroup = {
  readonly label: string;
  readonly value: string;
};

type ExperienceEntry = {
  readonly company: string;
  readonly role: string;
  readonly dates: string;
  readonly bullets: ReadonlyArray<string>;
};

type ProjectEntry = {
  readonly name: string;
  readonly technologies: string;
  readonly bullets: ReadonlyArray<string>;
};

type Resume = {
  readonly name: string;
  readonly contactLines: ReadonlyArray<ReadonlyArray<ContactPart>>;
  readonly education: ReadonlyArray<string>;
  readonly skills: ReadonlyArray<SkillGroup>;
  readonly experience: ReadonlyArray<ExperienceEntry>;
  readonly projects: ReadonlyArray<ProjectEntry>;
};

type RawEntry = {
  readonly heading: string;
  readonly bullets: ReadonlyArray<string>;
};

type RenderedOutput = {
  readonly fileName: string;
  readonly content: string;
  /** Generated Markdown and HTML are formatted with the repository's oxfmt setup. */
  readonly formatWithOxfmt: boolean;
};

const paragraphPattern = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g;

const inlineTokenPattern = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|<w:tab\s*\/>|<w:br\s*\/>/g;

const phonePattern = /^[\d\s\-()+]+$/;

/** Extract paragraph text from the WordprocessingML body, preserving tabs and breaks. */
function readParagraphTexts(documentXml: string): string[] {
  const paragraphs: string[] = [];

  for (const paragraphMatch of documentXml.matchAll(paragraphPattern)) {
    let text = "";

    for (const tokenMatch of (paragraphMatch[1] ?? "").matchAll(inlineTokenPattern)) {
      const [token, textContent] = tokenMatch;

      if (textContent !== undefined) {
        text += decodeXmlEntities(textContent);
      } else if (token.startsWith("<w:tab")) {
        text += "\t";
      } else if (token.startsWith("<w:br")) {
        text += "\n";
      }
    }

    const trimmed = text.trim();

    if (trimmed) {
      paragraphs.push(trimmed);
    }
  }

  return paragraphs;
}

function decodeXmlEntities(value: string): string {
  return value
    .replaceAll(/&#(\d+);/g, (_match: string, code: string) => String.fromCodePoint(Number(code)))
    .replaceAll(/&#x([0-9a-fA-F]+);/g, (_match: string, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

/** Split paragraphs into the header and the four resume sections, keyed by their headings. */
function splitSections(paragraphs: ReadonlyArray<string>) {
  const header: string[] = [];
  const education: string[] = [];
  const skills: string[] = [];
  const experience: string[] = [];
  const projects: string[] = [];

  let current = header;

  for (const paragraph of paragraphs) {
    switch (paragraph) {
      case "EDUCATION":
        current = education;
        break;
      case "TECHNICAL SKILLS":
        current = skills;
        break;
      case "PROFESSIONAL EXPERIENCE":
        current = experience;
        break;
      case "PROJECTS":
        current = projects;
        break;
      default:
        current.push(paragraph);
    }
  }

  return { header, education, skills, experience, projects };
}

/** Group a section's lines into entries; lines starting with "- " are bullets. */
function parseRawEntries(lines: ReadonlyArray<string>): RawEntry[] {
  const entries: Array<{ heading: string; bullets: string[] }> = [];

  for (const line of lines) {
    const lastEntry = entries.at(-1);

    if (line.startsWith("- ") && lastEntry) {
      lastEntry.bullets.push(line.slice(2).trim());
      continue;
    }

    entries.push({ heading: line, bullets: [] });
  }

  return entries;
}

function parseResume(paragraphs: ReadonlyArray<string>): Resume {
  const sections = splitSections(paragraphs);
  const [name = "", ...contactLines] = sections.header;

  return {
    name,
    contactLines: contactLines.map((line) =>
      line.split("|").flatMap((part) => {
        const text = part.trim();

        return text.length > 0 ? [{ text, href: resolveContactHref(text) }] : [];
      }),
    ),
    education: sections.education,
    skills: sections.skills.map((line) => {
      const separatorIndex = line.indexOf(": ");

      return separatorIndex === -1
        ? { label: line, value: "" }
        : { label: line.slice(0, separatorIndex), value: line.slice(separatorIndex + 2) };
    }),
    experience: parseRawEntries(sections.experience).map(({ heading, bullets }) => {
      const [company = heading, role = "", dates = ""] = heading.split(" | ");

      return { company, role, dates, bullets };
    }),
    projects: parseRawEntries(sections.projects).map(({ heading, bullets }) => {
      const [entryName = heading, technologies = ""] = heading.split(" | ");

      return { name: entryName, technologies, bullets };
    }),
  };
}

/** Resolve a contact fragment into a clickable link for the HTML and Markdown outputs. */
function resolveContactHref(text: string): string | null {
  if (text.includes("@")) {
    return `mailto:${text}`;
  }

  if (phonePattern.test(text)) {
    const digits = text.replace(/\D/g, "");

    return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
  }

  if (text.includes(".") && !text.includes(" ")) {
    return `https://${text}`;
  }

  return null;
}

function titleCase(value: string): string {
  return value.toLowerCase().replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function splitOnFirst(value: string, separator: string): [string, string] {
  const index = value.indexOf(separator);

  if (index === -1) {
    return [value, ""];
  }

  return [value.slice(0, index), value.slice(index + separator.length)];
}

function renderText(resume: Resume): string {
  const lines: string[] = [resume.name];

  for (const contactLine of resume.contactLines) {
    lines.push(contactLine.map((part) => part.text).join(" | "));
  }

  lines.push("", "EDUCATION", ...resume.education);
  lines.push("", "TECHNICAL SKILLS");
  lines.push(...resume.skills.map((skill) => `${skill.label}: ${skill.value}`));

  lines.push("", "PROFESSIONAL EXPERIENCE");

  for (const entry of resume.experience) {
    lines.push(`${entry.company} | ${entry.role} | ${entry.dates}`);
    lines.push(...entry.bullets.map((bullet) => `- ${bullet}`));
  }

  lines.push("", "PROJECTS");

  for (const entry of resume.projects) {
    lines.push(`${entry.name} | ${entry.technologies}`);
    lines.push(...entry.bullets.map((bullet) => `- ${bullet}`));
  }

  return `${lines.join("\n")}\n`;
}

function renderMarkdown(resume: Resume): string {
  const lines: string[] = [`# ${titleCase(resume.name)}`, ""];

  for (const contactLine of resume.contactLines) {
    const parts = contactLine.map((part) =>
      part.href ? `[${part.text}](${part.href})` : part.text,
    );

    lines.push(parts.join(" | "));
  }

  const [institutionLine = "", degreeLine = ""] = resume.education;
  const [institution, location] = splitOnFirst(institutionLine, ", ");
  lines.push("", "## Education", "", `### ${institution}`);

  if (location) {
    lines.push("", location);
  }

  if (degreeLine) {
    lines.push("", degreeLine);
  }

  lines.push("", "## Technical Skills", "");
  lines.push(...resume.skills.map((skill) => `- **${skill.label}:** ${skill.value}`));

  lines.push("", "## Professional Experience");

  for (const entry of resume.experience) {
    lines.push("", `### ${entry.company} | ${entry.role}`);

    if (entry.dates) {
      lines.push("", `*${entry.dates}*`);
    }

    lines.push("");
    lines.push(...entry.bullets.map((bullet) => `- ${bullet}`));
  }

  lines.push("", "## Projects");

  for (const entry of resume.projects) {
    lines.push("", `### ${entry.name} | ${entry.technologies}`, "");
    lines.push(...entry.bullets.map((bullet) => `- ${bullet}`));
  }

  return `${lines.join("\n")}\n`;
}

const htmlStyle = `\
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --fg: #1f2328;
  --muted: #57606a;
  --accent: #0969da;
  --rule: #d0d7de;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0d1117;
    --fg: #e6edf3;
    --muted: #9198a1;
    --accent: #4493f8;
    --rule: #30363d;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font:
    16px/1.55 -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Helvetica,
    Arial,
    sans-serif;
}

main {
  max-width: 52rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

header {
  margin-bottom: 2.25rem;
  text-align: center;
}

h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h2 {
  margin: 2.25rem 0 1rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--rule);
  font-size: 0.95rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h3 {
  margin: 1.25rem 0 0.35rem;
  font-size: 1.05rem;
}

p {
  margin: 0.35rem 0;
}

.contact {
  margin: 0.25rem 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.contact a {
  color: inherit;
}

.entry-meta {
  color: var(--muted);
  font-size: 0.9rem;
}

ul {
  margin: 0.4rem 0 0;
  padding-left: 1.25rem;
}

li {
  margin: 0.3rem 0;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.entry {
  break-inside: avoid;
}

@media print {
  body {
    font-size: 11pt;
  }

  main {
    max-width: none;
    padding: 0;
  }
}
`;

function renderHtml(resume: Resume): string {
  const displayName = titleCase(resume.name);

  const lines: string[] = [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${escapeHtml(displayName)} — Resume</title>`,
    "<style>",
    htmlStyle.trimEnd(),
    "</style>",
    "</head>",
    "<body>",
    "<main>",
    "<header>",
    `<h1>${escapeHtml(displayName)}</h1>`,
  ];

  for (const contactLine of resume.contactLines) {
    const parts = contactLine.map((part) =>
      part.href
        ? `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`
        : escapeHtml(part.text),
    );

    lines.push(`<p class="contact">${parts.join(" · ")}</p>`);
  }

  const [institutionLine = "", degreeLine = ""] = resume.education;
  const [institution, location] = splitOnFirst(institutionLine, ", ");
  lines.push("</header>", "<section>", "<h2>Education</h2>", '<div class="entry">');
  lines.push(`<h3>${escapeHtml(institution)}</h3>`);

  if (location) {
    lines.push(`<p class="entry-meta">${escapeHtml(location)}</p>`);
  }

  if (degreeLine) {
    lines.push(`<p>${escapeHtml(degreeLine)}</p>`);
  }

  lines.push("</div>", "</section>", "<section>", "<h2>Technical Skills</h2>", "<ul>");

  for (const skill of resume.skills) {
    lines.push(`<li><strong>${escapeHtml(skill.label)}:</strong> ${escapeHtml(skill.value)}</li>`);
  }

  lines.push("</ul>", "</section>", "<section>", "<h2>Professional Experience</h2>");

  for (const entry of resume.experience) {
    lines.push('<div class="entry">');
    lines.push(`<h3>${escapeHtml(entry.company)}</h3>`);
    lines.push(`<p class="entry-meta">${escapeHtml(entry.role)} · ${escapeHtml(entry.dates)}</p>`);
    lines.push("<ul>");
    lines.push(...entry.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`));
    lines.push("</ul>", "</div>");
  }

  lines.push("</section>", "<section>", "<h2>Projects</h2>");

  for (const entry of resume.projects) {
    lines.push('<div class="entry">');
    lines.push(`<h3>${escapeHtml(`${entry.name} | ${entry.technologies}`)}</h3>`);
    lines.push("<ul>");
    lines.push(...entry.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`));
    lines.push("</ul>", "</div>");
  }

  lines.push("</section>", "</main>", "</body>", "</html>");

  return `${lines.join("\n")}\n`;
}

async function formatWithOxfmt(fileName: string, source: string): Promise<string> {
  const result = await format(fileName, source);
  const firstError = result.errors[0];

  if (firstError) {
    throw new Error(`oxfmt could not format ${fileName}: ${firstError.message}`);
  }

  return result.code;
}

async function main(): Promise<void> {
  const archive = unzipSync(new Uint8Array(readFileSync(docxPath)));
  const documentXml = archive["word/document.xml"];

  if (!documentXml) {
    throw new Error(`Resume DOCX is missing word/document.xml: ${docxPath}`);
  }

  const resume = parseResume(readParagraphTexts(strFromU8(documentXml)));
  const isCheckMode = process.argv.includes("--check");

  const outputs: ReadonlyArray<RenderedOutput> = [
    { fileName: `${outputBaseName}.txt`, content: renderText(resume), formatWithOxfmt: false },
    { fileName: `${outputBaseName}.md`, content: renderMarkdown(resume), formatWithOxfmt: true },
    { fileName: `${outputBaseName}.html`, content: renderHtml(resume), formatWithOxfmt: true },
  ];

  let hasStaleOutput = false;

  const renderedOutputs = await Promise.all(
    outputs.map(async (output) => ({
      output,
      content: output.formatWithOxfmt
        ? await formatWithOxfmt(output.fileName, output.content)
        : output.content,
    })),
  );

  for (const { output, content } of renderedOutputs) {
    const targetPath = path.join(outputDirectory, output.fileName);
    const relativePath = path.relative(repositoryRoot, targetPath);

    if (isCheckMode) {
      let existing = "";

      try {
        existing = readFileSync(targetPath, "utf8");
      } catch {
        // A missing generated file counts as stale.
      }

      if (existing !== content) {
        hasStaleOutput = true;
        console.error(`out of date: ${relativePath}`);
      }

      continue;
    }

    writeFileSync(targetPath, content);
    console.log(`wrote ${relativePath}`);
  }

  if (!isCheckMode) {
    return;
  }

  if (hasStaleOutput) {
    console.error(
      "Resume formats are out of date. Run `npm run generate:resume` and commit the generated files.",
    );
    process.exitCode = 1;

    return;
  }

  console.log("Resume formats are up to date.");
}

await main();
