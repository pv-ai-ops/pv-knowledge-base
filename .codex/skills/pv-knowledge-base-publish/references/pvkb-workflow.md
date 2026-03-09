# PV Knowledge Base Publish Workflow (Repo-Specific)

## Inputs (Upload/Staging)

- `content-inbox/markdown/`
  - Put new posts as `*.md`.
  - If the post has embedded images/files, place a sibling folder named `Title.assets/` next to `Title.md`.
- `content-inbox/<bundle>/`
  - Put one article per directory when the source package already contains the Markdown body, cover image, and optional PDF deck together.
  - Each bundle must contain exactly one primary `.md`, optionally one `.pdf`, and optionally one cover image (`jpg/jpeg/png/webp`).
  - `*.ppt` and `*.pptx` are not ingested directly; convert them to PDF first.
  - Windows `:Zone.Identifier` sidecar files are ignored and cleaned automatically.
- `content-inbox/html/`
  - Put interactive `*.html` apps that must remain fully interactive.
  - These are copied into `source/` root and published as-is (Hexo `skip_render`).
- `content-inbox/pdf/`
  - Put `*.pdf` files that should be published with a PPT-like slide viewer.
  - These are copied into `source/assets/`, and a Markdown post is generated to embed the viewer and enable local search.
  - If the PDF has no text layer, add a same-basename sidecar `*.search.txt`/`*.txt`/`*.md` to provide the searchable text (e.g. generated via GPT vision from rendered page images).
- `content-inbox/covers/`
  - Optional cover images (shown only when present).
  - Filename basename must match the Markdown/HTML/PDF basename, e.g. `Foo.md` → `covers/Foo.webp`.
  - Supported formats: `jpg/jpeg/png/webp`.
- `content-inbox/assets/`
  - Put shared static assets copied into `source/assets/`.

## What `npm run publish` Does

The repo script `scripts/publish.js`:

- Converts post filenames to URL-safe names (keeps Chinese, removes problematic symbols).
- For Markdown posts:
  - Adds Front Matter if missing.
  - Copies `Title.assets/` into `source/assets/` with a unique prefix and rewrites image references to `/assets/...`.
- For directory bundles:
  - Uses the Markdown file as the main post body.
  - Copies the bundle cover into `source/assets/covers/`.
  - Writes both `cover` and `photos` into front matter so the NexT theme shows overview images on list and detail pages.
  - Strips a leading H1 when it duplicates the front matter title.
  - Copies the optional PDF into `source/assets/` and prepends the preview/download block to the top of the article body.
- For HTML apps:
  - Copies the HTML file into `source/` root (published as-is).
  - Generates a Markdown post embedding the app via an iframe so it appears in post lists.
- Runs `hexo clean && hexo generate`, outputting the static site into `docs/`.
- Deletes originals from `content-inbox/` after processing (inbox is a staging area).

## When to Use `publish` vs `build`

- Use `npm run publish` when there is new content in `content-inbox/` that needs to be imported into `source/`.
- Use `npm run clean && npm run build` when you changed rendering logic, repaired existing `source/_posts/`, or need to regenerate `docs/` without consuming more inbox files.

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
- Missing overview image: in this theme, `cover` alone is not enough for the post gallery; the post also needs `photos`.
- Duplicate page title: if the first body heading repeats the front matter title, remove the body H1 and keep the front matter title only.
- Wrong PDF position: bundle-attached PDF preview blocks should appear at the top of the article body, not at the bottom.
- Lost raw materials: `content-inbox/` is destructive staging. Back up new bundles to `.recovery/` or another archive before publishing.
- Wrong root path: preview and production are under `/pv-knowledge-base/` (not `/`).
- Preview still running: if `http://localhost:4000/pv-knowledge-base/` still opens, run `npm run preview:stop`.

## Release Gate

Before pushing `doc-page`, check the affected generated files:

- `source/_posts/<slug>.md`: front matter contains `cover` and `photos`, body does not start with a duplicate H1, and any PDF section is at the top.
- `docs/<yyyy>/<mm>/<dd>/<slug>/index.html`: contains `post-gallery` when a cover is expected, and shows the PDF preview block near the start of `.post-body`.
- `docs/index.html` or the relevant archive page: includes the new post card and cover image.
