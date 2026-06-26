---
# --- your existing Obsidian front-matter (untouched) ---
type: published
title: What I've Been Exploring This Week — June 26, 2026
pillar: weekly digest
source_briefs: ["[[Blast Radius Is the Design]]", "[[Whoever Deploys the Agent Owns the Blast Radius]]", "[[The Channel You Didnt Guard]]", "[[Liveness Is Not the Safe State]]", "[[The Scaffold Is the Capability]]", "[[The Black Box You Have to Understand]]", "[[Codify the Conventions Once]]", "[[What Format Should an Agent Read]]", "[[Own the Harness or Rent the Model]]", "[[Convergent Glue Wants to Be a Primitive]]", "[[What Looks Free Bills You in Production]]", "[[Cheap to Produce Expensive to Verify]]", "[[Capacity Is Gated by the Queue Not the Supply]]", "[[Speed Comes From Matching the Substrate]]", "[[AI Is a System Not a Tool]]", "[[AI Rewards the Expertise It Threatens]]", "[[Two Stories About Who AI Leaves Behind]]"]
published_date: 2026-06-26
tags: [published, newsletter]

# --- optional fields the site design uses (add these each week) ---
number: "027"
week: Week of June 22–26, 2026
kicker: The edge is the lever
thesis: "The thing in the headline — the model, the supply, the algorithm, the demo, the artifact — is never where the work is. What you draw around it is the boundary, and the boundary is where it's won or lost."
topics: [Boundaries, Agents, Infra, Cost]
---

#newsletter

# What I've Been Exploring This Week

**Week of June 22–26, 2026**

Last week the thread was that the obvious signal is never the lever - find the context. This week the context took a shape, and the shape was a boundary. Around every agent, every model, every resource I read about, the real question was the same: what did you put around the thing, and how far does it get when it fails? The model isn't the work. The supply isn't the limit. The algorithm isn't the speed. The demo isn't the cost. Every headline pointed at the center; the leverage sat at the edge. Seventeen threads this week, sorted into five.

---

## 1. Bound the blast radius before it bounds you

American Express partitions its payments platform into independent cells so one cell's failure can't cascade into the next. That's not caution bolted on after the fact — the blast radius is a first-class design input, decided up front. Now the mirror image: Amazon's Kiro agent, asked to fix a small bug, deleted and rebuilt a production environment using the engineer's full operator credentials with no approval gate. 13 hours of outage. An estimated 6.3 million lost orders. One bug fix. The gap between the two stories isn't talent or luck — it's whether anything bounded the thing when it failed. Agent identity and least privilege aren't red tape. They're cell walls by another name.

And the boundary keeps mattering most exactly where nobody declared one. A German court held Google liable for inaccuracies in its AI-generated search summaries — surface the answer, own the error. The same week, a $40 ESP32 build wired a Claude agent to always-on, unrestricted system access, gated only by a spoken "yes" the author openly admits is prompt discipline, not a hard lock. A courtroom and a hobby board reaching the same verdict: whoever deploys the agent owns the damage, and the confirmation step is the cheapest part of the system to build and the part that ends up in front of a judge. The breaches come through the channels you never named as trust boundaries — a forgotten Google Cloud debug endpoint chained into a $148,337 RCE; prompt injection persists because the model reads authority from text *style*, not the role tags meant to gate it, since instructions, tool output, and reasoning all ride one token stream. And the signal we trust most is the one that lies under load: a Postgres standby that's up but lagging looks perfectly healthy right up until you promote it and lose data. Liveness is not the safe state. Design failover and agent recovery around the state you can verify — lag, freshness, recoverability — not the heartbeat you can see.

- [Cell-Based Architecture for Resilient Payment Systems](https://americanexpress.io/cell-based-architecture-for-resilient-payment-systems/)
- [AI Coding Agent Horror Stories: The 13-Hour AWS Outage](https://www.docker.com/blog/coding-agent-horror-stories-the-13-hour-aws-outage/)
- [AI and Liability](https://www.schneier.com/blog/archives/2026/06/ai-and-liability.html)
- [Building a Voice Assistant with Claude Code](https://leonfurze.com/2026/06/25/building-a-voice-assistant-with-claude-code/)
- [StubZero: $148,337 RCE in Google Cloud Production](https://brutecat.com/articles/google-cloud-rce/)
- [A Mechanistic Explanation of Prompt Injection](https://www.lesswrong.com/posts/d8xDGzCEYE639qqEv/a-mechanistic-explanation-of-prompt-injection-and-why-you)
- [When Failover Isn't Safe: High-Availability PostgreSQL on Kubernetes](https://www.datadoghq.com/blog/engineering/postgresql-ha-kubernetes/)
- [The Agent Loop Architecture](https://x.com/djfarrelly/status/2067677007140278630)

## 2. The scaffold is the capability, not the model

The reproducible AI wins this week all came from the structure around the model, not the model. PostHog shipped an AI-written SQL parser roughly 70x faster than its C++ ANTLR predecessor — and the thing that made it safe wasn't a smarter model, it was property-based testing across thousands of generated queries. DoorDash got agents to finish long-running tasks not by enlarging the context window but by wiring persistent artifacts — plans, progress files, verification reports — into a state machine. Everyone credited the model. The 70x came from the tests. The model is a commodity; the harness is the moat.

The flip side of skipping that structure is debt. Most teams ship LLM-backed services without knowing how attention or the context window actually works, then bolt edge case onto edge case until the prompt is unreadable and welded to one model — switch models and you re-tune from scratch. That's prompt debt, and the interest is the internals knowledge you skipped. The cure is boring and it's the same cure as the rest of engineering: write the conventions down once so a tool reads them instead of someone reinventing them. A `dotnet new` template and a fat CLAUDE.md are the same artifact wearing different hats — externalized standards consumed by a tool — and a structured CLAUDE.md moved coding-agent output quality more than swapping the underlying model did. The one open question I'm still sitting with: what format you feed the agent depends on its actual bottleneck. Flat Markdown if the problem is *finding* context; structured docs if the problem is *understanding* it. Diagnose the agent before you reformat the docs.

- [I Wrote a 70X Faster SQL Parser While Barely Looking at the Code](https://posthog.com/blog/sql-parser)
- [Inside One Engineer's Journey to Master Long-Running Agents](https://careersatdoordash.com/blog/engineers-journey-long-running-ai-agents/)
- [Everything a Senior Engineer Needs to Know About What's Inside an LLM](https://www.pathtostaff.com/p/everything-a-senior-engineer-needs)
- [The Problem Is Prompt Debt](https://www.dbreunig.com/2026/06/22/the-problem-is-prompt-debt.html)
- [Stop Recreating .NET Solutions From Scratch](https://medium.com/@GhanavatSaeed/stop-recreating-net-solutions-from-scratch-10f81e3bab63)
- [I Built a Monster CLAUDE.md, And My Coding Agent Got Scary Good](https://medium.com/@sumit.ai/i-built-a-monster-claude-md-and-my-coding-agent-got-scary-good-31f7fc24df7f)
- [What Happens When You Give an LLM the Keys to Your Obsidian Vault](https://medium.com/@valerie_m/what-happens-when-you-give-an-llm-the-keys-to-your-obsidian-vault-370562d821e0)

## 3. Decide where the glue lives, before the vendor decides for you

If the harness is the moat, then where the harness lives is a bet — and this week the bet got harder to read. Opus 4.8 is being read as Anthropic absorbing the harness: memory, tool orchestration, multi-step control pulled *into* the model itself. The same week, GLM-5.2, an open-weight model, crossed the line of slotting into a coding harness and behaving like a capable general agent — making self-hosting the glue viable. Capability is centralizing into closed models and decentralizing into open weights at the same time. The glue code you're writing around the LLM has a shelf life, and the next model release sets it. Audit your harness for the parts the next release makes redundant, and stop investing there.

The cousin of that lesson at the infra layer: when independent teams keep writing the same glue, that's the ecosystem telling you a primitive is missing — or already exists and you haven't reached for it. Infra teams rebuild the same cache for ephemeral compute over and over, converging on the same design and paying the engineering cost in isolation every time. The counter-case is Modelplane, running a multi-cloud GPU inference fleet built entirely from Crossplane compositions and functions, with zero custom operators written. The skill isn't writing the glue faster. It's pushing it down a layer instead of into your repo.

- [What Anthropic Didn't Say About Opus 4.8: It's Absorbing Your Harness](https://medium.com/@han.heloir/what-anthropic-didnt-say-about-opus-4-8-it-s-anthropic-absorbing-your-harness-6d4ea10bf66d)
- [GLM-5.2 Is the Step Change for Open Agents](https://www.interconnects.ai/p/glm-52-is-the-step-change-for-open)
- [Every Team Is Building the Same Cache](https://www.tierfs.com/blog/every-team-builds-the-same-cache.html)
- [Building Modelplane on Crossplane](https://blog.crossplane.io/building-modelplane/)

## 4. The real cost shows up where you didn't look

The price you get quoted is the demo price. The bill arrives in production. `string.Split` allocates a new array plus a substring per token on every call — fine in a unit test, GC pressure under load — while a `ReadOnlySpan<char>` slice does the same parse with zero allocations. A DIY RAG demos in an afternoon, then the real cost shows up as chunking strategy, re-ranking, and evals, none of which were in the demo. The cheapest-looking line in the codebase is usually the one billing you at 10x load. And when production cost drops to near zero, the work doesn't vanish — it gets mailed downstream as verification. That's the effort economy of slop: anything cheaper to produce than to consume dumps the meaning-making on whoever reads it. Dropbox found only 12% of pull requests linked back to their security review and 54% of reviews were filed more than a month before the code shipped. The check didn't disappear. It piled up downstream, disconnected, and got skipped.

Same shape on the resource side: when capacity stalls, the queue that hands out the resource is almost always the limit, not the resource. US data centers can't plug in despite ample generation — interconnection queues are the rate-limiter. Netflix ran millions of batch jobs at poor utilization until Kueue added preemption and fair sharing and tenant switching became one click. You don't have a capacity problem; you have a queue problem. And when you finally do optimize, the biggest wins come from matching the substrate underneath, not outsmarting it with a cleverer algorithm: four bytes of struct padding made array clearing up to 49% faster by hitting the CPU's bulk-memory path, and training a speculative-decoding drafter on coding output instead of generic internet text delivered a 3.07x speedup. Profile the substrate before you rewrite the logic.

- [Why Senior .NET Developers Never Use string.Split](https://medium.com/@sunita.rawat.cgi/why-senior-net-developers-never-use-string-split-and-what-they-use-instead-3150fe36196d)
- [Dear IT Departments, Please Stop Trying To Build Your Own RAG](https://medium.com/@aldendorosario/dear-it-departments-please-stop-trying-to-build-your-own-rag-4546b4638273)
- [The Effort Economy of Slop](https://leonfurze.com/2026/03/28/the-effort-economy-of-slop/)
- [How Dropbox Uses MCP and Dash to Close the Design-to-Code Security Gap](https://dropbox.tech/security/dropbox-mcp-dash-design-code-security)
- [Why American Data Centers Can't Plug In](https://worksinprogress.co/issue/why-american-data-centers-cant-plug-in/)
- [How Netflix Simplified Batch Compute with Kueue](https://netflixtechblog.com/how-netflix-simplified-batch-compute-with-kueue-87860682629c)
- [How 4 Bytes of Padding Make Array Clearing 49% Faster](https://blog.andr2i.com/posts/2026-06-22-optimization-catalog-how-4-bytes-of-padding-make-array-clearing-49-faster)
- [Optimizing Models to be Fast at Codegen](https://www.morphllm.com/blog/codegen-inference-research)

## 5. AI lands on people, not artifacts

The unit of analysis everyone reaches for is the artifact — a model, an app, a policy document. It's the wrong unit. The tech behind GenAI barely changed from 2022 to 2026, yet the public hostility exploded, which means the anger was never really about the tech — it's about the system the tech moves through. Writing a standalone "AI policy" in 2026 is like writing an "internet policy" in 1996: a 1992 NSFNET rule banned commercial internet activity, and a standalone AI policy is typically stale within three to six months. Don't write an AI policy. Audit the ten policies AI already touches.

And when it lands on people, it doesn't level the field — it amplifies whoever already has expertise. Anthropic's agentic-coding research found domain expertise, not programming skill, predicted who succeeded with coding agents, with non-engineers matching engineers when they knew what to build. AI makes "knowing how" cheap and "knowing what" scarce — and the person most exposed isn't the expert it supposedly replaces, it's the novice who can't yet tell good output from confident garbage. There are really two different gaps here and they don't cancel out: the AWS CEO defends hiring 11,000 interns and juniors while selling white-collar automation (the jobs rung), while the genuinely powerful agentic workflows belong to people with Max subscriptions, capable hardware, and permission — not teachers on locked-down school devices (the access frontier). You can keep your job and still be locked out of the tools that make AI worth having. Before debating whether AI helps or hurts, name which gap you actually mean.

- [AI and the Techlash](https://leonfurze.com/2026/06/03/ai-and-the-techlash/)
- [You Don't Need an AI Policy](https://leonfurze.com/2026/03/15/you-dont-need-an-ai-policy/)
- [Agentic Coding and Persistent Returns to Expertise](https://www.anthropic.com/research/claude-code-expertise)
- [Resistance as a Framework for Combating Cognitive Offload](https://leonfurze.com/2026/03/22/resistance-as-a-framework-for-combating-cognitive-offload/)
- [The CEO of AWS on Why Amazon Is Hiring 11,000 Interns and Junior Employees](https://www.platformer.news/matt-garman-aws-ceo-interview-ai-jobs/)
- [IYKYK Part 6: Practice to Principles](https://leonfurze.com/2026/06/09/iykyk-part-6-practice-to-principles/)

---

The thread through all five: the thing in the headline is never where the work is. The boundary around the agent, the harness around the model, the queue in front of the resource, the substrate under the algorithm, the system around the artifact — that's the edge, and the edge is where it's won or lost. Stop staring at the center. Go look at what you drew around it.

See you next week.
