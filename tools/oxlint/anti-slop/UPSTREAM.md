# Vendored anti-slop plugin

Source: the `install-anti-slop` skill bundle at
`/Users/georgesuarezmbp/.agents/skills/install-anti-slop/assets/anti-slop`, copied verbatim on
2026-10-03. The bundle records no upstream repository or revision for the custom rules, so their
upstream identity is **unknown**. Treat the copied tree as the pristine snapshot for future merges;
if the skill bundle changes, re-copy into a staging directory and follow the update procedure
instead of editing in place.

Installed paths:

- `index.ts` — generic plugin (`anti-slop`), registered in `.oxlintrc.json` via `jsPlugins`.
- `effect/index.ts` — opt-in Effect rules. Deliberately not registered: this repository has no
  direct `effect` dependency.
- `vendor/eslint-stylistic/` — vendored `padding-line-between-statements` rule used by
  `require-readable-spacing`. Its upstream repository and exact commit are recorded in
  `vendor/eslint-stylistic/UPSTREAM.md` and identify the copied assets.

Dependency and configuration changes made at installation:

- `oxlint` and `@oxlint/plugins` are pinned to the same exact version (`1.86.0`) so plugin API and
  linter move together.
- The vendored tree is excluded from Oxlint and oxfmt via `tools/oxlint/anti-slop/**` in
  `.oxlintrc.json` and `.oxfmtrc.json`.

Intentional deviations: none. Local policy lives in `.oxlintrc.json`; do not edit vendored rule
implementations in place.
