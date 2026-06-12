---
# --- your existing Obsidian front-matter (untouched) ---
type: published
title: What I've Been Exploring This Week — June 5, 2026
pillar: weekly digest
source_briefs: ["[[the-same-agent-attacks-and-defends]]", "[[determinism-is-allocated-by-risk]]", "[[gpu-costs-are-fixed-in-the-scheduler]]", "[[the-org-chart-caught-up-to-the-judgment-thesis]]", "[[the-spec-is-becoming-executable]]", "[[human-checking-doesnt-scale-to-agent-volume]]", "[[agent-leverage-is-a-legibility-dividend]]", "[[latency-is-bought-with-deliberate-waste]]"]
published_date: 2026-06-05
tags: [published, newsletter]

# --- optional fields the site design uses ---
number: "024"
week: Week of June 1–5, 2026
kicker: Structure does the earning
thesis: "Agents don’t get trusted. They earn it — and the structure around them does the earning."
topics: [Agents, Architecture, Infra, Org]
---

#newsletter

# What I've Been Exploring This Week

**Week of June 1–5, 2026**

Eight threads this week. One theme kept surfacing: agents don't get trusted. They earn it — and the structure around them does the earning. Here's what stuck.

---

## 1. Stop debating agents vs pipelines

It's the wrong question. Production systems run both — agents where blast radius is low, deterministic pipelines with human gates where it's high. Grab lets agents roam freely on the read-only investigation path and gates the single write path behind human review. Result: up to 40% of incoming data queries resolved with no human in the loop, across 15,000+ tables, recovering 2 senior-engineer days per week. And the allocation isn't static — Devin crossed into majority-unsupervised sessions only after test suites, sandboxes, and approval gates earned it. Determinism is a budget, not an architecture.

- [Build Agents, Not Pipelines](https://www.seangoedecke.com/build-agents-not-pipelines/) — Goedecke's framework
- [How Grab Is Using AI Agents to Boost Team Productivity](https://blog.bytebytego.com/p/how-grab-is-using-ai-agents-to-boost)
- [Verifying Agentic Development at Scale](https://links.tldrnewsletter.com/6tpNcS) — Cognition on Devin's async crossover

## 2. Human checking doesn't scale to agent volume

When agents act at volume, a human checking each action stops being a safeguard and becomes a queue. Anthropic's containment work says it plainly: a sandbox with a bounded blast radius is a more reliable control than a human watching the agent. The Claude Code team re-pointed code review away from style and bug-catching — tooling's job now — toward the judgment calls that actually need a human. The control that scales isn't attention. It's architecture.

- [How We Contain Claude Across Products](https://www.anthropic.com/engineering/how-we-contain-claude)
- [Running an AI-Native Engineering Org](https://claude.com/blog/running-an-ai-native-engineering-org)
- [From Firefighting to Building](https://engineering.grab.com/from-firefighting-to-building) — agents on repetitive volume, not novel cases

## 3. Agent leverage is a legibility dividend

Spotify merged 2.5 million agent PRs and saw PR frequency jump 76%. Their Chief Architect credits years of Backstage and Fleet Management standardization — not the model. 99% of their engineers already used AI weekly; adoption was never the constraint. A uniform codebase the agent could touch safely was. Before chasing a smarter model, ask whether your codebase is readable — to a machine.

- [Coding Is No Longer the Constraint — Spotify Engineering](https://engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint/)
- [Modern Engineering Values](https://cpojer.net/posts/modern-engineering-values) — the repo itself must carry the context

## 4. The spec is becoming executable

Prose requirements are dying. Henrik Warne now communicates requirements to Claude as tests — the suite moved from safety net behind the work to specification in front of it. /goal makes "done" an explicit termination condition. AWS's SRE agent delivers a remediation spec consumed by another agent — the human reviews the handoff. Even the format follows: Anthropic's teams feed Claude HTML, not Markdown, because structure carries semantics prose flattens. Ambiguity is now the most expensive property a requirement can have.

- [With Claude: Less Coding, More Testing](https://henrikwarne.com/2026/05/31/with-claude-less-coding-more-testing/)
- [The Ultimate Guide to /goal](https://links.tldrnewsletter.com/Mf7cZO)
- [Building an End-to-End Agentic SRE Using AWS DevOps Agent](https://aws.amazon.com/blogs/devops/building-an-end-to-end-agentic-sre-using-aws-devops-agent/)
- [The Unreasonable Effectiveness of HTML](https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html)

## 5. The same agent attacks and defends

PostHog pointed an autonomous agent at slow production queries overnight. It found a 3-year-old ClickHouse primary-key misuse humans had stared past for years — 62% fewer granules scanned, 11% faster. Sysdig documented what looks like the first AI-driven attack: marimo CVE to full PostgreSQL exfiltration in under 2 minutes, across 4 pivots. Same skill set — inhuman patience, inhuman speed. Different employer. Offense automates the full kill chain today; defense still routes findings through human review. Our incident response timelines were calibrated for human attackers.

- [Karpathy's Autoresearch Found a 3-Year-Old Bug in PostHog's Query Engine](https://posthog.com/blog/karpathy-autoresearch-query-engine-bug)
- [AI Agent at the Wheel — Sysdig](https://webflow.sysdig.com/blog/ai-agent-at-the-wheel-how-an-attacker-used-llms-to-move-from-a-cve-to-an-internal-database-in-4-pivots)

## 6. Your GPU problem is a scheduler problem

The biggest AI infra cost wins this year came from allocation software, not silicon. Databricks cut GPU costs over 80% with per-workload "model units" wired into load balancing and autoscaling. DigitalOcean's prefix-aware routing lifted KV cache hit rates from ~25% to 75%+, cut inference costs up to 4x, and recovered up to 340 GPU-hours per day at 10M requests. The macro story matches: the inference price collapse is quantization, speculative decoding, batching. Software, software, software. Before the hardware requisition, read your cache hit rate.

- [Reliable LLM Inference at Scale — Databricks](https://www.databricks.com/blog/reliable-llm-inference-scale)
- [The Inference Tax — DigitalOcean](https://www.digitalocean.com/blog/reduce-llm-inference-costs-prefix-caching)
- [AI's Plummeting Prices Are a Software Story](https://weightythoughts.com/p/ais-plummeting-prices-are-a-software)

## 7. Latency is bought with deliberate waste

Every fast system hides a deliberately under-utilized warm buffer. GKE Standby Buffers keep pre-provisioned nodes warm so scale-up doesn't wait on a cold boot. Prefix-aware routing keeps shared prefixes resident — same trick, different layer. Connection pools and thread pools have done this forever. Cold starts are a tax, and you prepay it with capacity that looks idle right up until the spike. The skill isn't eliminating the waste. It's sizing it.

- [Introducing the GKE Standby Buffer](https://cloud.google.com/blog/products/containers-kubernetes/gke-standby-buffers-speed-up-autoscaling-for-less-spend/)
- [The Inference Tax — DigitalOcean](https://www.digitalocean.com/blog/reduce-llm-inference-costs-prefix-caching)

## 8. The org chart caught up to the judgment thesis

"Value moved from output to judgment" stopped being a think-piece and became policy. Braze: 60%+ of committed code is AI-generated, and senior engineers were formally re-scoped to own specification and architecture, not implementation. Interviews are shifting from LeetCode to paid trial projects with AI allowed — coding signal got leveled, so judgment is what's left to measure. The backdrop: developers spend only 14% of their time writing code. The institutions are repricing toward the other 86%.

- [How Braze's CTO Is Rethinking Engineering for the Agentic Era](https://stackoverflow.blog/2026/05/13/rethinking-engineering-for-the-agentic-area/)
- [The Last Technical Interview](https://links.tldrnewsletter.com/UTLytb)
- [A Practical Guide to Becoming an AI-Native Engineer](https://blog.bytebytego.com/p/a-practical-guide-to-becoming-an)

---

The thread through all eight: stop guarding the action. Design the room it happens in.

See you next week.
