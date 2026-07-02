---
name: format-newsletter
description: Format a freshly exported Obsidian newsletter post in _posts/ for publishing on the Jekyll site — adds the site-design front-matter block (number, week, kicker, thesis, topics) and validates the body structure. Use when the user says "format the new post", "prep for publishing", or has just dropped a new YYYY-MM-DD-newsletter.md into _posts/.
---

# Format Newsletter Post for Publishing

Posts are authored in Obsidian and exported to `_posts/YYYY-MM-DD-newsletter.md`. The site's `assets/js/enhance.js` restructures the raw markdown client-side, so the **body is never edited** — publishing prep is purely a front-matter task plus a structural validation pass.

## Step 1 — Locate the post

The target is usually the untracked file in `_posts/` (`git status --short`), or the newest by filename. Confirm with the user if more than one candidate exists.

## Step 2 — Keep the Obsidian front matter untouched

Do not remove or reorder the exported fields (`type`, `title`, `pillar`, `source_briefs`, `published_date`, `platform`, `impressions`, `bookmarks`, `tags`). Add this comment line directly under the opening `---`:

```yaml
# --- your existing Obsidian front-matter (untouched) ---
```

## Step 3 — Append the site-design block

Directly before the closing `---`, add (blank line after the Obsidian fields, then):

```yaml
# --- optional fields the site design uses (add these each week) ---
number: "028"
week: Week of June 27 – July 2, 2026
kicker: Judgment is the scarce resource
thesis: "One–three sentence distillation of the issue's through-line."
topics: [Verification, Routing, Perf, Moats]
```

How each field is derived:

- **number** — previous issue's `number` + 1, zero-padded 3-digit string in quotes (`"029"`). Check the most recent post in `_posts/` for the last value.
- **week** — copy the bold `**Week of …**` line from the body verbatim (without the asterisks). Shown in the issue header meta (`data-week-slot` in `_layouts/issue.html`).
- **kicker** — a short punchy phrase (≤ 6 words) naming the issue's theme. Derive it from the closing synthesis paragraph. Shown on the home page featured card and in prev/next issue navigation. Examples: "The edge is the lever", "Judgment is the scarce resource".
- **thesis** — 1–3 sentences distilling the through-line, usually a tightened paraphrase of the synthesis paragraph (the one after the final `---` starting "The thread through all …"). Rendered as the "This week's thread" pull-quote at the top of the issue and as the card blurb on the home page. Quote it in YAML.
- **topics** — 3–5 one-word tags, one per major theme, matching the register of prior issues (e.g. Boundaries, Agents, Infra, Cost, Verification, Routing, Perf, Moats). Shown as chips on the home-page archive rows.

Where these render: `_layouts/issue.html` (number, week, kicker, thesis), `_layouts/home.html` (number, kicker, thesis, topics, week).

## Step 4 — Validate body structure (report, don't rewrite)

`enhance.js` depends on this exact shape — verify each and flag anything off to the user:

1. A `#newsletter` line and an `# H1` at the top (both are stripped client-side — fine to keep, do not delete).
2. A bold `**Week of …**` paragraph after the H1.
3. Intro paragraph(s), then a `---` rule, then the threads, then a final `---` rule, then the synthesis.
4. Each thread is an `## N. Title` heading, body paragraph(s), and **one** bullet list of `[Title](url)` links (the first `<ul>` in a thread is treated as its link list).
5. The synthesis paragraph ideally starts `The thread through all N:` — the text before the colon becomes the synthesis label.
6. A closing line starting `See you next week` (becomes the signoff; author name is appended automatically).
7. Title front-matter format: `What I've Been Exploring This Week — <Month D, YYYY>` matching the filename date.

## Step 5 — Wrap up

- Do not commit unless asked. Repo convention when publishing: branch named `YYYY-MM-DD` (issue date), commit like `Add <Month D> newsletter issue (No. NNN)`, PR to `main` (never commit to main).
- Summarize what was added (number, week, kicker, thesis, topics) and any validation flags so the user can adjust the editorial fields before publishing.
