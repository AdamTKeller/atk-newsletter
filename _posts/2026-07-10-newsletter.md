---
# --- your existing Obsidian front-matter (untouched) ---
type: published
title: What I've Been Exploring This Week — July 10, 2026
pillar: weekly digest
source_briefs: ["[[delete-the-work-beats-tuning-it]]", "[[Fold the Lookup Into the Path]]", "[[The General Engine Keeps Eating Specialist Databases]]", "[[Put the Guarantee Outside the Actor]]", "[[Cross-Cutting Concerns Belong in One Owned Layer]]", "[[Model Safety and System Permission Are Different Battles]]", "[[Cheap Failure Beats No Failure]]", "[[correctness-lives-in-the-concurrent-edges]]", "[[The Demo Ages, the Outcome Gap Doesnt]]", "[[The Answerable End Wont Compress]]", "[[The Exam Only Measures the Absence]]", "[[Two Tribes That Wont Read the Thing]]", "[[Interpretability Is the Escape Hatch From Verification]]", "[[The Data Bill Comes Due as Margins Collapse]]", "[[Cheap Inference Decentralizes Power]]", "[[Idle Capacity Becomes a Product]]", "[[Autonomy Pressure Becomes Architecture]]", "[[Hiring Seniors While Cutting the Path to Senior]]"]
published_date: 2026-07-10
platform:
impressions:
bookmarks:
tags: [published, newsletter]

# --- optional fields the site design uses (add these each week) ---
number: "029"
week: Week of July 3 – July 10, 2026
kicker: Location is a design decision
thesis: "Nothing this week got better by being improved in place — the wins came from moving something: work off the hot path, the guarantee out of the actor, safety into the undo, the check toward the inside of the model. Where responsibility lives is a design decision; make it on purpose."
topics: [Perf, Boundaries, Resilience, Cost, Orgs]
---

#newsletter

# What I've Been Exploring This Week

**Week of July 3 – July 10, 2026**

Last week everything scarce turned out to be a form of judgment. This week the question became *where to put things*. Almost nothing I read got faster, safer, or smarter by improving the component in place - the wins came from moving something: work off the hot path, the guarantee out of the actor, the safety story from prevention to undo, the check from the output to the inside of the model. And the arguments that looked technical kept turning out to be arguments about where responsibility lives. Eighteen threads this week, sorted into seven.

---

## 1. The fastest code is the code that never runs

Cloudflare cut WAF ML inference time 82% - not with a faster model, but by going branchless and SIMD so the work that remained fit the hardware. Workers Cache goes further: on a cache hit the Worker doesn't run at all, and the CPU bill is zero. DigitalOcean pushed a load balancer past 1,000,000 concurrent connections by switching from proxy to passthrough - Katran/XDP plus BGP/ECMP - so the box stopped terminating what it only needed to forward. None of these optimized the work. They deleted it.

Same move one layer down: stop caching the lookup, design it out. OpenAI routes voice traffic for 900M weekly users by reading the routing key out of the ICE ufrag in the first STUN packet - zero database lookups on the hot path. ScyllaDB folded its separate summary and index files into a single trie the read already walks: 20–230% more throughput, 31–63% lower latency. A cache admits you still need the lookup. A better structure means you never did. And at the largest scale, you can delete an entire database: DataFusion runs PageRank on 1.05B edges in 5GB of RAM and connected components on 1.96B edges in 10GB with plain spill-aware relational operators, while Iceberg v3 shreds semi-structured JSON into typed Parquet columns on the engine you already operate. Before standing up a specialist graph or document store, price the right layout on the engine you already run.

- [Making WAF ML Models Go Brrr - Saving Decades of Processing Time](https://blog.cloudflare.com/making-waf-ai-models-go-brr)
- [How OpenAI Delivers Low Latency Voice AI for 900M Users](https://blog.bytebytego.com/p/how-openai-delivers-low-latency-voice)
- [Algorithms on Billion-Scale Graphs Using 10GB RAM - I Love DataFusion](https://semyonsinchenko.github.io/ssinchenko/post/datafusion-graphs-cc-2/)

## 2. Put the guarantee outside the actor

A database team and an AI harness reached for the same fix this week. Canonical used a TLA+ model to prove a 16-year-old SQLite WAL corruption bug can't fire under dqlite's locking - the guarantee lives in the model checker, not in trusting the code. Meanwhile Armin Ronacher documented the inverse surprise: Opus 4.8 and Sonnet 5 solve harder tasks but *append invalid fields to strict tool schemas* - the smarter model breaks your contract more, not less. The fix isn't a sterner prompt; it's grammar-constrained decoding. Capability and compliance are different axes, and reliability lives on the second one. Stop asking whether the actor behaves. Build the boundary that decides for it.

Where does that boundary live? In one owned layer - and we've known this since before agents existed. Airbnb's monolith-to-SOA migration worked because they centralized data hydration instead of letting every service re-implement it. The 2026 version puts SQL, schema, lineage, and blast-radius validation in one deterministic correctness layer that agents call, instead of scattering checks across prompts. If your agents each re-implement validation, you've already scattered the thing that should be centralized. And the boundary that gets forgotten entirely: permissions. Anthropic's GRAM isolates dual-use knowledge inside model weights - and the same week, Noma's GitLost showed a prompt injection in a public GitHub issue steering GitHub's agent into leaking private repos, using nothing but the access the agent already had. Model safety and system permission are different battles with zero overlap. As we wire agents into our own stack: their service accounts deserve exactly the IAM scrutiny we'd give any service, because the model's virtue won't cover for it.

- [Better Models: Worse Tools](https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/)
- [GitLost - How We Tricked GitHub's AI Agent into Leaking Private Repos](https://noma.security/blog/gitlost-how-we-tricked-githubs-ai-agent-into-leaking-private-repos/)
- [Hunting a 16-Year-Old SQLite Bug with TLA+: Is dqlite Affected?](https://ubuntu.com/blog/hunting-a-16-year-old-sqlite-bug-with-tla-is-dqlite-affected)

## 3. Engineer the undo before the guarantee

The safest systems this week didn't prevent failure - they made it boring. EKS now rolls back a failed Kubernetes upgrade within 7 days, no cluster rebuild. Grab migrated a high-QPS counter store to Aerospike with zero downtime using shadow traffic and config-driven rollback, and picked up ~50% lower p99 and per-node cost on the way. Postgres under strict memory overcommit converts a process-wide OOM kill into a clean allocation error that a single backend handles. Three unrelated changes, one purchase: they all bought safety as a cheap, named undo instead of a confident guarantee. Before your next risky change, ask one question - what does reversing it cost? If you can't name the rollback path, you don't have a safety story, you have a hope.

And when you estimate the work itself, scope it by the concurrent edges, not the happy path. PgDog needs a full SQL parser just to keep session state coherent through a shared connection. Postgres's on-disk layout is genuinely simple - pages, tuples, heap, TOAST - and its complexity concentrates in concurrency edge cases. Notion's browser-side SQLite cache reduced to exactly one hard problem: serializing cross-tab writes through a single SharedWorker so tabs don't corrupt each other. Your database isn't complicated because of how it stores a row. It's complicated because two things touched that row at once. Estimate accordingly.

- [Migrating Counter Service Storage: Design Choices and Learnings](https://engineering.grab.com/counter-service-storage-migration)
- [PostgreSQL and the OOM Killer: Why We Use Strict Memory Overcommit](https://www.ubicloud.com/blog/postgresql-and-the-oom-killer-why-we-use-strict-memory-overcommit)
- [Why We Built Yet Another Postgres Connection Pooler (PgDog)](https://pgdog.dev/blog/why-yet-another-connection-pooler)

## 4. The gap that gets invoiced

Two years of model progress closed every benchmark gap except the one denominated in money. In 2024, Klarna claimed its chatbot replaced two-thirds of support roles; inspection showed it automated L1 tickets - something companies did before LLMs existed. In 2026, Fable 5 and Opus 4.8 score effectively zero on lifting website conversion despite frontier artifact metrics, and Eli Lilly is buying smaller purpose-built models instead. Same gap, much better models - which means it's a measurement problem, not a capability problem scaling will fix. Ask "what outcome moved?" before "what benchmark improved?"

The gap shows up in our own trade too, with numbers. Across ~100,000 developers using AI agents, code volume rose 8x while releases rose about a third. The HTMX author rated AI 50/50 on a real parser bug: excellent at debugging, confidently wrong on the fix - a human had to catch it. AI compresses the part of the work you can carry in your head and leaves untouched the part you have to answer for. You can route an enormous amount of work through a machine. You cannot route the accountability. Optimize your role toward the deliver end, because that's the end that didn't compress.

- [Fable 5 vs Opus 4.8: Outcomes-Based Assessments Are a Massive Warning for Frontier AI Labs](https://vinvashishta.substack.com/p/fable-5-vs-opus-48-outcomes-based)
- [Where Does Expertise Live?](https://leonfurze.com/2026/07/01/where-does-expertise-live/)

## 5. Detection isn't repair

The most honest exam of 2026 gave half the class a failing grade and taught nobody anything. A Brown professor moved the final in-person: 18 students dropped, 9 no-showed, and 22 of those 27 had perfect midterms. The class average fell from 96 to 48. The exam switched the lights on in a room the course had been emptying all semester - it measured the absence precisely, and repaired nothing. If your only trustworthy instrument fires once, after the damage, that's not an assessment system, it's an autopsy. Australia's assessment authorities saw this coming and moved most grading away from exams by design. The same failure mode lives in how we read each other: across 13 experiments, disclosing AI use makes readers trust you *less*, while readers detect AI text at near chance - so the tell everyone relies on doesn't work, and the incentive it creates points backwards. antirez makes the mirror-image point about the reflexive anti-AI take: it skips the hard part, which is actually using the tools. Both tribes judge on a surface signal instead of reading the thing. The tell is cheap. The judgment is expensive. Pay for the judgment.

There's one genuinely new exit on the horizon. Verification is the bottleneck - agents produce faster than humans review, and last week ended on exactly that note. Anthropic's global-workspace research found that LLMs form an internal workspace separating deliberate reasoning from background activity, and use it to report on their own thoughts. If reasoning has a locatable address inside the network, checking the work by watching it think becomes a real alternative to grading outputs from the outside. Near-term, external review stays the job. But this is the thread to watch.

- [We Cannot Choose to Become Idiots: The AI Cheating Scandal Roiling Brown University](https://arstechnica.com/ai/2026/07/we-cannot-choose-to-become-idiots-the-ai-cheating-scandal-roiling-brown-university/)
- [AI;DR: When Readers Stop Trusting Writers](https://leonfurze.com/2026/07/05/aidr-when-readers-stop-trusting-writers/)
- [A Global Workspace in Language Models](https://www.anthropic.com/research/global-workspace)

## 6. Check the depreciation schedule, not the strategy deck

The AI economy's two curves crossed this week. Data costs are heading toward $100B a year by 2030 as training goes from compute-limited to data-limited - right as GLM-5.2-class models get cheap enough to absorb everyday work and drain the premium-inference markup that was supposed to fund those data buys. The frontier may end up belonging to whoever owns the data, not whoever trains the model. Watch the balance sheet, not the benchmark.

But the same cost collapse that squeezes the labs redistributes the capability. A $40,000 box now runs near-Opus-level models locally; ~$2,000 runs a capable one; and small models are landing in clinics and farms with no data center and no broadband. The margin threat and the access win are one phenomenon. And when someone overbuilds for the frontier anyway, the surplus becomes a product: a vLLM server on HF Jobs rents inference by the second with no fleet to own, and Meta - still almost entirely an ad business - is standing up a cloud on the back of its AI buildout. Nobody sets out to build a cloud. Past a certain size, they just can't stand watching the hardware sit idle.

- [GLM 5.2 and the Coming AI Margin Collapse (Part 1)](https://martinalderson.com/posts/the-upcoming-ai-margin-collapse-part-1-glm-5-2/)
- [A Stargate for Data](https://threadreaderapp.com/thread/2074178395462848800.html)
- [Meta's Inevitable Cloud](https://spyglass.org/meta-cloud/)

## 7. The org chart is load-bearing

Nobody chooses a distributed monolith. Teams choose autonomy, and the monolith distributes itself. The microfrontend literature is replaying the microservices arc almost word for word - promised independence, delivered deployment overhead, version skew, and a distributed monolith when split wrong - and Jason Cohen's autonomy-vs-admin essay names the underlying force: local optimization doesn't sum to global optimization. Every argument for splitting a system is secretly an argument about who gets to deploy without asking. A network boundary is autonomy made permanent, billed monthly. Here's the test worth running on any boundary proposal, ours included: if teams would still want the split with zero deploy friction in the monolith, it's architecture. If not, it's a reorg wearing an architecture costume - so decide it the way you'd decide a reorg.

The other org decision hiding in plain sight: AI-heavy spenders grew engineering headcount, concentrated in judgment and integration roles - while AI torched the junior market by automating exactly the write-code-to-spec work that used to be the apprenticeship rung. Demand for seniors is up and the pipeline that produces them is being cut. The payroll looks fine today; the question is who's senior in 2032. For a team like ours, that makes deliberate apprenticeship - review, pairing, handing juniors the judgment work early - a supply-chain investment, not a nicety.

- [The Tension Between Autonomy and Administrative Efficiency](https://longform.asmartbear.com/tension-autonomy-admin/)
- [AI Has Torched the Market for Junior Programmers](https://seldo.com/posts/ai-has-torched-the-market-for-junior-programmers/)

---

The thread through all seven: placement. Nothing this week got better by being improved in place - the wins came from moving the work off the hot path, the guarantee out of the actor, the safety into the undo, the check from the output toward the inside, the boundary decision from the architecture doc to the org conversation where it belonged. Last week's scarce resource was judgment. This week showed where to spend it: not on making the component better, but on deciding where the responsibility lives. Location is a design decision. Make it on purpose.

See you next week.
