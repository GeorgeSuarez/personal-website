# Website URL

Link to the website: https://georgejsuarez.com

## Development

- `npm install` — install dependencies
- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and build to `dist/`
- `npm run preview` — build and serve the Cloudflare Worker locally
- `npm run deploy` — build and deploy with Wrangler
- `npm run lint` / `npm run format` — check lint and formatting (`format:fix` to write)

## Resume

The resume source of truth is `public/George_Suarez_Resume.docx`. The TXT, Markdown, and HTML variants are generated from it by `scripts/generate-resume-formats.ts`:

- Regenerate after replacing the DOCX: `npm run generate:resume`
- Verify the generated files are up to date: `npm run generate:resume:check`
