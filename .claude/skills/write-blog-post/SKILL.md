---
name: write-blog-post
description: Use when the user wants to write a new blog post for the enginyyr-blog (Astro/AstroPaper) — from a raw idea through research, drafting in house style, local preview, image handling, featured management, and commit/push. Triggers include "write a blog post", "new article", "draft a post about X", or "let's write the next post".
---

# Write a Blog Post (enginyyr-blog)

This blog is an **Astro 4 / AstroPaper** site. Posts are MDX/Markdown files in
`src/content/blog/`, rendered at `/posts/<slug>/`. This skill reproduces the
full author workflow: research → interview → draft in house style → preview
locally → images → featured → commit.

Work *with* the user at each stage — this is collaborative authoring, not a
one-shot generator. Don't fabricate the user's opinions or first-person
experience; ask for them.

## 0. Orient

- Confirm the topic/idea in one line. If it's vague, ask 1–2 narrowing questions.
- Look at the current posts to learn conventions and pick the next filename:

  ```bash
  ls src/content/blog/ | grep -E '^[0-9]+-' | sort -t- -k1 -n | tail -5
  ```

  Files are numbered `NNN-slug.mdx`. **Take the highest prefix and add 100**
  (e.g. last is `2700-…` → new post is `2800-…`). Most posts are `.mdx`.

- Read the schema once so frontmatter validates: `src/content/config.ts`.
  Required fields: `pubDatetime` (date), `title`, `description`. Optional but
  used: `modDatetime`, `featured`, `draft`, `tags`, `ogImage`, `canonicalURL`.

- Read 1–2 recent featured posts (e.g. `2600-*.mdx`, `2500-*.md`) to absorb
  the **house voice**: essay-driven, grounded, no hype, strong opening
  anecdote, a `## Table of contents` marker right after the header image,
  inline-cited links woven into prose (not a footnote dump).

## 1. Research (if the topic needs sources)

For anything factual/news-driven, build a cited source pack BEFORE drafting:

- `WebSearch` for the topic, then `WebFetch` the 3–5 highest-value sources
  (prefer primary sources + independent analysis + hands-on reviews).
- Capture exact figures, feature names, pricing, and quotable lines, each
  attributed to a URL. Present the pack to the user before writing so they
  can steer.
- Every external claim in the final post gets an inline markdown link to its
  source. This blog cites generously.

For an experience/opinion piece with no external sources, skip to step 2.

## 2. Decide angle + voice, then interview

- Use `AskUserQuestion` to pin down **angle** (what the piece argues) and
  **voice** (first-person hands-on vs. synthesis-with-commentary).
- If the piece is **first-person**, you do NOT have the user's real
  experience — interview them. Ask `AskUserQuestion` for the concrete
  moments: a win, a failure, specific tools/features used, anything that
  surprised them. Use their actual words as the spine; back them with cited
  facts. Never invent personal anecdotes.

## 3. Draft

Write `src/content/blog/NNN-slug.mdx` with frontmatter:

```yaml
---
pubDatetime: <ISO 8601, e.g. 2026-05-31T16:00:00.000Z>
modDatetime: <same as pubDatetime on first write>
title: "<title>"
slug: <kebab-slug>            # used in the URL: /posts/<slug>/
featured: false              # leave false until the user decides (see step 6)
tags:
  - ai
  - <relevant tags>
description: "<1–2 sentence hook, used for SEO + cards>"
ogImage: "https://cdn.enginyyr.com/<image>.png"
draft: true                  # see step 4 — drafts 404 locally
---

<header image — see step 5>

## Table of contents

<body…>
```

House-style checklist for the body:
- Open with a concrete scene or tension, not a definition.
- Keep the `## Table of contents` marker (AstroPaper auto-populates it).
- Inline-link every external claim to its source.
- Cross-link related posts as `/posts/<slug>/` (this repo's convention).
- Demote benchmark/number dumps; lead with the human takeaway.
- End with a crisp verdict, not a summary.

## 4. Preview locally — REQUIRED

Always confirm it renders before declaring done.

```bash
pnpm dev   # run in background; serves http://localhost:4321/
```

Wait for `ready in`, then check HTTP status:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4321/posts/<slug>/
```

- **404** almost always means `draft: true` — AstroPaper filters drafts out of
  routing. Set `draft: false` to view it (flip back before commit if it's not
  ready to publish).
- **500** means a content-collection error. One bad frontmatter entry throws
  for *every* route, so a 500 on an unrelated post still points at your edit.
  Read the dev-server output for `InvalidContentEntryFrontmatterError`.
- The `[glob-loader] cannot be used for files in src/content` **warning is
  pre-existing and benign** — Amplify builds through it. Don't "fix" it.

## 5. Images

- Images are served from `https://cdn.enginyyr.com/<name>.png`. Confirm an
  asset exists before using it: `curl -s -o /dev/null -w '%{http_code}'
  https://cdn.enginyyr.com/<name>.png` should be 200. If the user names an
  image, use it; otherwise ask.
- `ogImage` should be the **full, uncropped** image (best for social cards).
- If a square/tall image renders too large, crop the *displayed* header with
  CSS — render symmetrically by replacing the markdown image with:

  ```html
  <img
    src="https://cdn.enginyyr.com/<name>.png"
    alt="<alt>"
    style="width:100%; aspect-ratio:4/3; object-fit:cover; object-position:center; border-radius:0.375rem;"
  />
  ```

  `object-fit:cover` + centered position trims top and bottom equally and
  stays responsive. Dial the crop with `aspect-ratio`: `5/4` (gentle) →
  `4/3` → `16/9` (banner).

## 6. Featured management

The homepage highlights `featured: true` posts. The user keeps this set
small (≈3–4 most recent). When asked to feature the new post, ask whether to
unfeature an older one to stay within the target.

**GOTCHA — flipping `featured` in bulk.** Do NOT use a regex whose trailing
anchor can eat the newline; it glues the next key on (`featured: falsetags:`),
which silently breaks YAML for every post. Use `[ \t]`, never `\s*$`:

```bash
# safe — matches spaces/tabs only, preserves the newline
perl -i -pe 's/^featured:[ \t]*true[ \t]*$/featured: false/' <file>
```

After any bulk edit, verify the diff is *only* the intended flip:

```bash
git diff -U0 src/content/blog/*.md src/content/blog/*.mdx \
  | grep -E '^[+-]' | grep -v '^[+-][+-]' | sort | uniq -c
# expect only:  -featured: true  /  +featured: false
```

## 7. Commit + push (only when the user asks)

Set `draft: false` and finalize `featured` first. Then:

```bash
git add -A && git commit -F - <<'MSG'
<concise subject>

<body explaining the post + any featured changes>

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
MSG
git push origin main
```

The site deploys via AWS Amplify on push to `main`. Mention that the rebuild
will pick it up. Only commit/push when the user explicitly says so.
