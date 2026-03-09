---
name: pv-knowledge-base-publish
description: Automate the PV Knowledge Base (Hexo) post-upload pipeline—process content-inbox Markdown/HTML/assets, build docs/ via npm run publish, optionally start/stop local preview, and deploy by committing and pushing docs/ + source/ to doc-page (GitHub Actions publishes gh-pages). Use when asked to 打包/发布/上线 PV knowledge base after uploading new content.
---

# PV Knowledge Base Publish

## Overview

Package and publish the PV Knowledge Base site after new content is uploaded into `content-inbox/`.

## Workflow

1. Stage content into `content-inbox/` (Markdown / HTML apps / assets).
2. Back up `content-inbox/` first when the raw source files are not recoverable elsewhere; `npm run publish` deletes processed inbox files.
3. Run publish/build to generate `source/` + `docs/`.
4. Validate the affected `source/_posts/` and generated `docs/` output before deploy, especially after changing `scripts/publish.js` or adding a new inbox format.
5. (Optional) Start preview to validate (typically with `--no-deploy`), then stop preview.
6. Deploy by committing `docs/` + `source/` and pushing `doc-page`.

## Quick Commands (Manual)

- Publish + build: `npm run publish`
- Rebuild existing `source/` without re-consuming `content-inbox/`: `npm run clean && npm run build`
- Publish + build + start preview (background): `npm run publish:preview`
- Stop preview: `npm run preview:stop`
- Deploy (commit + push `doc-page`, stages all tracked files via `git add .`): `npm run deploy`

## Preferred Automation (Script)

Run the pipeline script from this skill:

```bash
# Publish + deploy (default: deploy + checkout enabled)
python ".codex/skills/pv-knowledge-base-publish/scripts/pvkb_publish.py" --repo /path/to/pv-knowledge-base

# Preview only (publish + preview, no deploy)
python ".codex/skills/pv-knowledge-base-publish/scripts/pvkb_publish.py" --repo /path/to/pv-knowledge-base --preview --no-deploy
```

Tip: if you installed this skill globally, the script may also live at `$CODEX_HOME/skills/pv-knowledge-base-publish/scripts/pvkb_publish.py` (default `~/.codex`).

Common flags:

- `--preview`: run publish and start preview on `http://localhost:4000/pv-knowledge-base/` (use `--no-deploy` to avoid pushing)
- `--stop-preview`: stop preview server (port 4000) after starting it
- `--deploy/--no-deploy`: commit + push `docs/` + `source/` to `doc-page` (default: deploy enabled)
- `--checkout/--no-checkout`: auto-checkout deployment branch before deploy (default: enabled)
- `--commit-message "..."`: custom deploy commit message
- `--include-all`: include tracked changes outside `docs/` and `source/` in the deploy commit
- `--dry-run`: print planned commands without running them

## Inputs

- `content-inbox/markdown/`: new `.md` posts; optional sibling folder `Title.assets/` for images/files used by that post
- `content-inbox/html/`: interactive `.html` apps that must be kept as-is (published via `skip_render`)
- `content-inbox/pdf/`: `.pdf` files published with a PPT-like slide viewer; auto-generates a post and extracts text for local search (if the PDF has no text layer, add a same-basename sidecar `*.search.txt`/`*.txt`/`*.md` to provide the searchable text)
- `content-inbox/covers/`: optional cover images; filename basename must match the Markdown/HTML/PDF basename (e.g. `Foo.md` → `covers/Foo.webp`); supported: `jpg/jpeg/png/webp` (missing cover = hidden)
- `content-inbox/assets/`: shared static assets copied to `source/assets/`
- `content-inbox/<bundle>/`: directory-style bundle input for one article. Each bundle should contain exactly one `.md`, optionally one `.pdf`, and optionally one cover image (`jpg/jpeg/png/webp`). The PDF is embedded into the same post. `.ppt/.pptx` must be converted to PDF first.

## Safety

Expect the publish step to delete originals from `content-inbox/` after processing; back up important source files first.

## Validation Gate

Before deploy, verify the affected generated pages and source posts:

- If a post has a visual cover, its front matter should contain both `cover` and `photos`; this theme renders overview images from `photos`.
- If the first Markdown heading matches the post title, remove that body heading and keep only the front matter title.
- For bundle posts with PDF attachments, confirm the PDF preview/download block is at the top of the article body, not appended at the end.
- Confirm the generated article HTML contains the expected gallery/cover markup and the home/archive pages show the cover image.
- If you changed `scripts/publish.js` or repaired existing posts in `source/_posts/`, run `npm run clean && npm run build` even when `content-inbox/` is empty.

## Notes

For repo specifics and troubleshooting, read `references/pvkb-workflow.md`.
