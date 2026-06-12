# What I've Been Exploring This Week

A weekly newsletter on system design & AI, published with **Jekyll on GitHub Pages**.
You write the same Markdown you already write — the site turns each issue into the
Terminal/Technical design, and auto-builds the archive, prev/next, read-time and
jump-nav.

---

## Publish it (one time)

1. Create a GitHub repo (e.g. `newsletter`).
2. Copy **everything inside this `jekyll-site/` folder** into the repo root and push.
3. Repo **Settings → Pages → Build and deployment → Source: _Deploy from a branch_**,
   branch `main`, folder `/ (root)`. Save.
4. Wait ~1 minute. Your site is live at:
   - **User/org page** — `https://<user>.github.io/` (rename the repo to `<user>.github.io`). Leave `baseurl: ""` in `_config.yml`.
   - **Project page** — `https://<user>.github.io/newsletter/`. Set `baseurl: "/newsletter"` in `_config.yml`.

RSS is generated automatically at `/feed.xml`.

## Run it locally (optional, to preview before pushing)

```bash
cd jekyll-site
bundle install
bundle exec jekyll serve --livereload
# open http://localhost:4000
```

Requires Ruby. On macOS: `brew install ruby`, then `gem install bundler`.

---

## Add a new issue each week

Create a file in `_posts/` named by date:

```
_posts/2026-06-19-newsletter.md
```

Front-matter — only the bottom block matters to the site; the rest can stay exactly
as your Obsidian export:

```yaml
---
number: "026"                      # shown as “No. 026”, drives the counter
week: Week of June 15–19, 2026     # shown in the issue meta + archive
kicker: A short label              # archive teaser / prev-next label
thesis: "The one-line through-line for the week."   # the hero pull-quote
topics: [Security, Infra, Org]     # small tags on the archive card
---
```

Then write the body **exactly like you do now**:

- A short intro paragraph (becomes the hero, under `thesis`).
- `---` to start the threads.
- Each thread: `## N. Headline`, a paragraph, then a bullet list of links
  (`- [Title](url) — optional note`).
- `---` to end the threads.
- A closing line in the form **`Label: the takeaway.`** (the part before the colon
  becomes the section header), then `See you next week.`

You can leave your `#newsletter` tag and the duplicate `# What I've Been Exploring…`
H1 in the file — both are stripped automatically.

That's it. Commit, push, done.

---

## How it renders (for the curious)

`Markdown → Kramdown (Jekyll) → assets/js/enhance.js`. The JS splits the rendered
body on its `---` rules into intro / threads / synthesis and rebuilds it with the
design's classes (styled by `assets/css/style.css`). If JavaScript is off, the raw
markdown still renders readably (fallback styles in `assets/css/pipeline.css`).

```
jekyll-site/
├─ _config.yml            site settings + baseurl
├─ _layouts/              default · issue · home
├─ _includes/             head · masthead · footer
├─ _posts/                your weekly .md issues
├─ assets/css/            style.css (design) · pipeline.css (build glue)
├─ assets/js/enhance.js   markdown → design transform + theme toggle
└─ index.html             the archive / home page
```

Light/dark is a toggle in the masthead; the choice persists across the site
(navy is the default).
