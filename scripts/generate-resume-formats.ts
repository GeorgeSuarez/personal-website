/**
 * Regenerates the TXT, Markdown, HTML, and PDF resume variants from the DOCX source of truth.
 *
 * The DOCX at public/George_Suarez_Resume.docx is canonical. It uses the resume's visible
 * sections (Summary, Skills, Projects, Experience, Education); run `npm run generate:resume`
 * after replacing it and `npm run generate:resume:check` to validate the derived files.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import { format } from "oxfmt";
import { renderWithChrome } from "./chrome-render.ts";

const repositoryRoot = path.join(import.meta.dirname, "..");

const publicDirectory = path.join(repositoryRoot, "public");

const resumeBaseName = "George_Suarez_Resume";

const resumeDocxPath = path.join(publicDirectory, `${resumeBaseName}.docx`);

const resumePdfPath = path.join(publicDirectory, `${resumeBaseName}.pdf`);

const pdfSignature = "%PDF-";

const pdfHeaderByteLength = 8;

type ContactPart = {
  readonly text: string;
  readonly href: string | null;
};

type SkillGroup = {
  readonly label: string;
  readonly value: string;
};

type ResumeEntry = {
  readonly heading: string;
  readonly bullets: ReadonlyArray<string>;
};

type ResumeData = {
  readonly name: string;
  readonly headline: string;
  readonly contactLines: ReadonlyArray<ReadonlyArray<ContactPart>>;
  readonly summary: string;
  readonly skills: ReadonlyArray<SkillGroup>;
  readonly projects: ReadonlyArray<ResumeEntry>;
  readonly additionalProjects: string;
  readonly experience: ReadonlyArray<ResumeEntry>;
  readonly education: string;
};

type ResumeSections = {
  readonly header: string[];
  readonly summary: string[];
  readonly skills: string[];
  readonly projects: string[];
  readonly experience: string[];
  readonly education: string[];
};

type RenderedResumeFile = {
  readonly fileName: string;
  readonly content: string;
  readonly formatWithOxfmt: boolean;
};

const paragraphPattern = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g;

const inlineTokenPattern =
  /<w:hyperlink\b([^>]*)>([\s\S]*?)<\/w:hyperlink>|<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|<w:tab\s*\/>|<w:br\s*\/>/g;

const hyperlinkTextPattern = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;

const relationshipPattern = /<Relationship\b([^>]*)\/>/g;

const phonePattern = /^[\d\s\-()+]+$/;

const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Reads external links from the DOCX relationships so resume links survive format conversion. */
function readResumeHyperlinkTargets(relationshipsXml: string): Map<string, string> {
  const targets = new Map<string, string>();

  for (const relationshipMatch of relationshipsXml.matchAll(relationshipPattern)) {
    const attributes = relationshipMatch[1] ?? "";
    const relationshipType = /\bType="([^"]+)"/.exec(attributes)?.[1];
    const relationshipId = /\bId="([^"]+)"/.exec(attributes)?.[1];
    const target = /\bTarget="([^"]+)"/.exec(attributes)?.[1];
    const targetMode = /\bTargetMode="([^"]+)"/.exec(attributes)?.[1];

    if (
      relationshipType?.endsWith("/hyperlink") &&
      targetMode === "External" &&
      relationshipId &&
      target
    ) {
      targets.set(relationshipId, decodeXmlEntities(target));
    }
  }

  return targets;
}

/** Reads DOCX paragraphs, preserving line breaks, hyperlinks, and unordered-list bullets. */
function readResumeDocxParagraphs(
  documentXml: string,
  hyperlinkTargets: ReadonlyMap<string, string>,
): string[] {
  const paragraphs: string[] = [];

  for (const paragraphMatch of documentXml.matchAll(paragraphPattern)) {
    const paragraphXml = paragraphMatch[1] ?? "";
    const isBullet = /<w:numPr(?:\s|>)/.test(paragraphXml);
    let paragraphText = "";

    for (const tokenMatch of paragraphXml.matchAll(inlineTokenPattern)) {
      const [, hyperlinkAttributes, hyperlinkXml, textContent] = tokenMatch;

      if (hyperlinkAttributes !== undefined) {
        const relationshipId = /\br:id="([^"]+)"/.exec(hyperlinkAttributes)?.[1];

        const linkLabel = Array.from(hyperlinkXml.matchAll(hyperlinkTextPattern), (match) =>
          decodeXmlEntities(match[1] ?? ""),
        ).join("");

        const target = relationshipId ? hyperlinkTargets.get(relationshipId) : undefined;

        paragraphText += target ? `[${linkLabel}](${target})` : linkLabel;
      } else if (textContent !== undefined) {
        paragraphText += decodeXmlEntities(textContent);
      } else if (tokenMatch[0].startsWith("<w:tab")) {
        paragraphText += "\t";
      } else if (tokenMatch[0].startsWith("<w:br")) {
        paragraphText += "\n";
      }
    }

    for (const line of paragraphText.split("\n")) {
      const trimmedLine = line.trim();

      if (trimmedLine) paragraphs.push(isBullet ? `- ${trimmedLine}` : trimmedLine);
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

/** Splits the source document into its resume sections, accepting standard legacy headings too. */
function splitResumeSections(paragraphs: ReadonlyArray<string>): ResumeSections {
  const sections: ResumeSections = {
    header: [],
    summary: [],
    skills: [],
    projects: [],
    experience: [],
    education: [],
  };

  let currentSection = sections.header;

  for (const paragraph of paragraphs) {
    switch (paragraph.toUpperCase()) {
      case "SUMMARY":
        currentSection = sections.summary;
        break;
      case "SKILLS":
      case "TECHNICAL SKILLS":
        currentSection = sections.skills;
        break;
      case "PROJECTS":
        currentSection = sections.projects;
        break;
      case "EXPERIENCE":
      case "PROFESSIONAL EXPERIENCE":
        currentSection = sections.experience;
        break;
      case "EDUCATION":
        currentSection = sections.education;
        break;
      default:
        currentSection.push(paragraph);
    }
  }

  return sections;
}

/** Groups DOCX section lines into headings and dash-prefixed bullets. */
function parseResumeEntries(lines: ReadonlyArray<string>): ResumeEntry[] {
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

/** Converts one contact fragment into its visible text and optional web or mail link. */
function parseResumeContactPart(part: string): ContactPart {
  const markdownLink = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);

  if (markdownLink) {
    return { text: markdownLink[1] ?? part, href: markdownLink[2] ?? null };
  }

  return { text: part, href: resolveContactHref(part) };
}

/** Parses the canonical DOCX content into the resume's current section order. */
function parseResumeDocument(paragraphs: ReadonlyArray<string>): ResumeData {
  const sections = splitResumeSections(paragraphs);
  const [name = "", headline = "", ...contactParagraphs] = sections.header;

  const additionalProjectsLine = sections.projects.find((line) =>
    line.toLowerCase().startsWith("additional projects:"),
  );

  const projectLines = sections.projects.filter((line) => line !== additionalProjectsLine);
  const skillLines = sections.skills.map((line) => line.replace(/^- /, ""));

  return {
    name,
    headline,
    contactLines: contactParagraphs.map((line) =>
      line
        .split("|")
        .map((part) => parseResumeContactPart(part.trim()))
        .filter((part) => part.text),
    ),
    summary: sections.summary.join(" "),
    skills: skillLines.map((line) => {
      const separatorIndex = line.indexOf(": ");

      return separatorIndex === -1
        ? { label: line, value: "" }
        : { label: line.slice(0, separatorIndex), value: line.slice(separatorIndex + 2) };
    }),
    projects: parseResumeEntries(projectLines),
    additionalProjects: additionalProjectsLine?.replace(/^Additional projects:\s*/i, "") ?? "",
    experience: parseResumeEntries(sections.experience),
    education: sections.education.join(" "),
  };
}

function resolveContactHref(text: string): string | null {
  if (text.includes("@")) return `mailto:${text}`;

  if (phonePattern.test(text)) {
    const digits = text.replace(/\D/g, "");

    return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
  }

  if (text.includes(".") && !text.includes(" ")) return `https://${text}`;

  return null;
}

function stripMarkdownLinks(value: string): string {
  return value.replace(markdownLinkPattern, "$1");
}

function renderResumeText(resume: ResumeData): string {
  const lines: string[] = [resume.name, resume.headline];

  for (const contactLine of resume.contactLines) {
    lines.push(contactLine.map((part) => part.text).join(" | "));
  }

  lines.push("", "SUMMARY", resume.summary, "", "SKILLS");
  lines.push(...resume.skills.map((skill) => `${skill.label}: ${stripMarkdownLinks(skill.value)}`));
  lines.push("", "PROJECTS");

  for (const project of resume.projects) {
    lines.push(stripMarkdownLinks(project.heading));
    lines.push(...project.bullets.map((bullet) => `- ${stripMarkdownLinks(bullet)}`));
  }

  if (resume.additionalProjects) {
    lines.push(`Additional projects: ${stripMarkdownLinks(resume.additionalProjects)}`);
  }

  lines.push("", "EXPERIENCE");

  for (const role of resume.experience) {
    lines.push(stripMarkdownLinks(role.heading));
    lines.push(...role.bullets.map((bullet) => `- ${stripMarkdownLinks(bullet)}`));
  }

  lines.push("", "EDUCATION", stripMarkdownLinks(resume.education));

  return `${lines.join("\n")}\n`;
}

function renderResumeMarkdown(resume: ResumeData): string {
  const lines: string[] = [`# ${resume.name}`, "", `## ${resume.headline}`, ""];

  for (const contactLine of resume.contactLines) {
    lines.push(
      contactLine
        .map((part) => (part.href ? `[${part.text}](${part.href})` : part.text))
        .join(" | "),
    );
  }

  lines.push("", "## Summary", "", resume.summary, "", "## Skills", "");
  lines.push(...resume.skills.map((skill) => `- **${skill.label}:** ${skill.value}`));
  lines.push("", "## Projects");

  for (const project of resume.projects) {
    lines.push("", `### ${project.heading}`, "");
    lines.push(...project.bullets.map((bullet) => `- ${bullet}`));
  }

  if (resume.additionalProjects) {
    lines.push("", `**Additional projects:** ${resume.additionalProjects}`);
  }

  lines.push("", "## Experience");

  for (const role of resume.experience) {
    lines.push("", `### ${role.heading}`, "");
    lines.push(...role.bullets.map((bullet) => `- ${bullet}`));
  }

  lines.push("", "## Education", "", formatResumeEducationMarkdown(resume.education));

  return `${lines.join("\n")}\n`;
}

function formatResumeEducationMarkdown(education: string): string {
  const [degree = "", ...details] = education.split(" | ");

  return details.length > 0 ? `**${degree}** | ${details.join(" | ")}` : `**${degree}**`;
}

function renderInlineResumeHtml(value: string): string {
  let html = "";
  let previousEnd = 0;

  for (const match of value.matchAll(markdownLinkPattern)) {
    const matchIndex = match.index ?? 0;
    const label = match[1] ?? "";
    const href = match[2] ?? "";
    html += escapeHtml(value.slice(previousEnd, matchIndex));
    html += `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
    previousEnd = matchIndex + match[0].length;
  }

  return html + escapeHtml(value.slice(previousEnd));
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const resumeHtmlStyle = `
  @page { size: Letter; margin: 0.42in 0.58in 0.42in 0.58in; }
  html { font-size: 10pt; }
  body {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    color: #1a1a1a; font-size: 9.8pt; line-height: 1.265;
    margin: 0; padding: 0;
    -webkit-font-smoothing: antialiased;
  }
  h1 {
    font-size: 18.5pt; line-height: 1.1; margin: 0 0 2pt 0;
    color: #0d2b57; letter-spacing: -0.3pt;
  }
  h1 + p { margin: 0; font-size: 9.2pt; line-height: 1.45; color: #333; }
  h2 {
    font-size: 9.4pt; text-transform: uppercase; letter-spacing: 0.8pt;
    color: #0d2b57; margin: 8.5pt 0 3.5pt 0; padding-bottom: 1.4pt;
    border-bottom: 0.8pt solid #0d2b57; page-break-after: avoid;
  }
  h3 {
    font-size: 9.9pt; margin: 6pt 0 0.5pt 0; color: #111;
    page-break-after: avoid;
  }
  h3 + p { margin-top: 0; }
  p { margin: 0 0 2.6pt 0; }
  ul { margin: 1.5pt 0 3.5pt 0; padding-left: 13pt; }
  li { margin: 0 0 1.5pt 0; padding-left: 1pt; }
  li > p { margin: 0; }
  a { color: inherit; text-decoration: none; }
  code { white-space: nowrap; }
  strong { color: #111; }
  hr { border: 0; border-top: 0.8pt solid #0d2b57; margin: 10pt 0; }
`;

/** Renders the complete resume HTML in the same compact navy-and-Arial layout as the PDF. */
function renderResumeHtml(resume: ResumeData): string {
  const lines: string[] = [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="utf-8" />',
    `  <title>${escapeHtml(resume.name)} Resume</title>`,
    "  <style>",
    resumeHtmlStyle.trimEnd(),
    "  </style>",
    "</head>",
    '<body class="resume">',
    `<h1>${escapeHtml(resume.name)}</h1>`,
    `<h2>${renderInlineResumeHtml(resume.headline)}</h2>`,
    `<p>${resume.contactLines
      .map((line) =>
        line
          .map((part) =>
            part.href
              ? `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`
              : escapeHtml(part.text),
          )
          .join(" | "),
      )
      .join("<br />\n")}</p>`,
    "<h2>Summary</h2>",
    `<p>${renderInlineResumeHtml(resume.summary)}</p>`,
    "<h2>Skills</h2>",
    "<ul>",
    ...resume.skills.map(
      (skill) =>
        `<li><strong>${escapeHtml(skill.label)}:</strong> ${renderInlineResumeHtml(skill.value)}</li>`,
    ),
    "</ul>",
    "<h2>Projects</h2>",
  ];

  for (const project of resume.projects) {
    lines.push(`<h3>${renderInlineResumeHtml(project.heading)}</h3>`, "<ul>");
    lines.push(...project.bullets.map((bullet) => `<li>${renderInlineResumeHtml(bullet)}</li>`));
    lines.push("</ul>");
  }

  if (resume.additionalProjects) {
    lines.push(
      `<p><strong>Additional projects:</strong> ${renderInlineResumeHtml(resume.additionalProjects)}</p>`,
    );
  }

  lines.push("<h2>Experience</h2>");

  for (const role of resume.experience) {
    lines.push(`<h3>${renderInlineResumeHtml(role.heading)}</h3>`, "<ul>");
    lines.push(...role.bullets.map((bullet) => `<li>${renderInlineResumeHtml(bullet)}</li>`));
    lines.push("</ul>");
  }

  lines.push(
    "<h2>Education</h2>",
    `<p>${renderResumeEducationHtml(resume.education)}</p>`,
    "</body>",
    "</html>",
  );

  return `${lines.join("\n")}\n`;
}

function renderResumeEducationHtml(education: string): string {
  const [degree = "", ...details] = education.split(" | ");
  const renderedDegree = `<strong>${escapeHtml(degree)}</strong>`;

  return details.length > 0
    ? `${renderedDegree} | ${details.map(escapeHtml).join(" | ")}`
    : renderedDegree;
}

async function formatResumeGeneratedFile(fileName: string, source: string): Promise<string> {
  const result = await format(fileName, source);
  const firstError = result.errors[0];

  if (firstError) {
    throw new Error(`Resume format error for ${fileName}: ${firstError.message}`);
  }

  return result.code;
}

/** Checks that the committed resume PDF is present and has a PDF signature. */
function isResumePdfValid(): boolean {
  if (!existsSync(resumePdfPath)) {
    console.error(`Missing public/${resumeBaseName}.pdf. Run: npm run generate:resume`);

    return false;
  }

  const header = readFileSync(resumePdfPath).subarray(0, pdfHeaderByteLength).toString("latin1");

  if (!header.startsWith(pdfSignature)) {
    console.error(`Invalid resume PDF at public/${resumeBaseName}.pdf.`);

    return false;
  }

  return true;
}

async function main(): Promise<void> {
  const archive = unzipSync(new Uint8Array(readFileSync(resumeDocxPath)));
  const documentXml = archive["word/document.xml"];
  const relationshipsXml = archive["word/_rels/document.xml.rels"];

  if (!documentXml || !relationshipsXml) {
    throw new Error(`Resume source DOCX is missing document content or links: ${resumeDocxPath}`);
  }

  const hyperlinkTargets = readResumeHyperlinkTargets(strFromU8(relationshipsXml));
  const paragraphs = readResumeDocxParagraphs(strFromU8(documentXml), hyperlinkTargets);
  const resume = parseResumeDocument(paragraphs);
  const isCheckMode = process.argv.includes("--check");

  const generatedFiles: ReadonlyArray<RenderedResumeFile> = [
    {
      fileName: `${resumeBaseName}.txt`,
      content: renderResumeText(resume),
      formatWithOxfmt: false,
    },
    {
      fileName: `${resumeBaseName}.md`,
      content: renderResumeMarkdown(resume),
      formatWithOxfmt: true,
    },
    {
      fileName: `${resumeBaseName}.html`,
      content: renderResumeHtml(resume),
      formatWithOxfmt: true,
    },
  ];

  const formattedFiles = await Promise.all(
    generatedFiles.map(async (generatedFile) => ({
      generatedFile,
      content: generatedFile.formatWithOxfmt
        ? await formatResumeGeneratedFile(generatedFile.fileName, generatedFile.content)
        : generatedFile.content,
    })),
  );

  let hasStaleResumeFile = false;

  for (const { generatedFile, content } of formattedFiles) {
    const targetPath = path.join(publicDirectory, generatedFile.fileName);

    if (isCheckMode) {
      let existingContent = "";

      try {
        existingContent = readFileSync(targetPath, "utf8");
      } catch {
        // A missing generated resume file counts as stale.
      }

      if (existingContent !== content) {
        hasStaleResumeFile = true;
        console.error(`Out-of-date resume file: public/${generatedFile.fileName}`);
      }

      continue;
    }

    writeFileSync(targetPath, content);
    console.log(`Wrote public/${generatedFile.fileName}`);
  }

  if (isCheckMode) {
    if (!isResumePdfValid()) hasStaleResumeFile = true;

    if (hasStaleResumeFile) {
      console.error(
        "Resume formats are stale. Run `npm run generate:resume` and commit the generated files.",
      );
      process.exitCode = 1;

      return;
    }

    console.log("Resume formats are up to date.");

    return;
  }

  const pdfRendered = await renderWithChrome({
    label: `${resumeBaseName}.pdf`,
    outputPath: resumePdfPath,
    target: pathToFileURL(path.join(publicDirectory, `${resumeBaseName}.html`)).href,
    chromeArgs: ["--no-pdf-header-footer", `--print-to-pdf=${resumePdfPath}`],
  });

  if (!pdfRendered || !isResumePdfValid()) {
    process.exitCode = 1;

    return;
  }

  console.log(`Wrote public/${resumeBaseName}.pdf`);
}

await main();
