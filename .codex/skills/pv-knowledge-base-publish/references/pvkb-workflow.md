# PV Knowledge Base Publish Workflow (Repo-Specific)

## Inputs (Upload/Staging)

- `content-inbox/markdown/`
  - Put new posts as `*.md`.
  - If the post has embedded images/files, place a sibling folder named `Title.assets/` next to `Title.md`.
- `content-inbox/html/`
  - Put interactive `*.html` apps that must remain fully interactive.
  - These are copied into `source/` root and published as-is (Hexo `skip_render`).
- `content-inbox/pdf/`
  - Put `*.pdf` files that should be published with a PPT-like slide viewer.
  - These are copied into `source/assets/`, and a Markdown post is generated to embed the viewer and enable local search.
  - If the PDF has no text layer, add a same-basename sidecar `*.search.txt`/`*.txt`/`*.md` to provide the searchable text (e.g. generated via GPT vision from rendered page images).
- `content-inbox/assets/`
  - Put shared static assets copied into `source/assets/`.

## What `npm run publish` Does

The repo script `scripts/publish.js`:

- Converts post filenames to URL-safe names (keeps Chinese, removes problematic symbols).
- For Markdown posts:
  - Adds Front Matter if missing.
  - Copies `Title.assets/` into `source/assets/` with a unique prefix and rewrites image references to `/assets/...`.
- For HTML apps:
  - Copies the HTML file into `source/` root (published as-is).
  - Generates a Markdown post embedding the app via an iframe so it appears in post lists.
- Runs `hexo clean && hexo generate`, outputting the static site into `docs/`.
- Deletes originals from `content-inbox/` after processing (inbox is a staging area).

## Preview

- Start: `npm run publish:preview` (or run the skill script with `--preview`)
- Open: `http://localhost:4000/pv-knowledge-base/`
- Stop: `npm run preview:stop`

## Deploy

Deploy is triggered by pushing branch `doc-page`.

- Local: `npm run deploy` (commits and pushes), or use the skill script with `--deploy` for safer staging.
- CI: `.github/workflows/deploy.yml` builds and publishes `docs/` to `gh-pages`.

## Common Gotchas

- Broken images: ensure Markdown references are `/assets/...` (publish script rewrites these when using `Title.assets/`).
- Wrong root path: preview and production are under `/pv-knowledge-base/` (not `/`).
- Preview still running: if `http://localhost:4000/pv-knowledge-base/` still opens, run `npm run preview:stop`.
