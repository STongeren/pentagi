# NullHawk — Launch Kit

Ready-to-adapt go-to-market copy for NullHawk: a self-serve, hosted autonomous pentest tool for individual security researchers and bug-bounty hunters. Everything here assumes the product's hard rule — **authorized testing only, every target ownership-verified before a flow runs** — and leans into it as a trust signal rather than hiding it.

> Positioning note: during private beta, say "private beta" and "request access", not "sign up now". Don't overclaim features that aren't live yet (e.g. per-tenant BYO-key still needs backend work — see `docs/saas/03-billing-and-onboarding.md`).

---

## 1. Positioning

**One-liner (primary):**
> NullHawk is an AI pentest team you point at your own targets — it plans, runs the tools, and hands you a report.

**One-liner variants:**
- For speed: *"Autonomous pentesting for researchers. Verify a target you own, describe the goal, get findings."*
- For trust: *"An autonomous red-team that refuses to run until you've proven the target is yours."*
- For the skeptic: *"Not another scanner. A team of agents that plan, exploit in a sandbox, and report — on infrastructure you control."*

**Ideal customer profile (ICP):** individual security researchers, bug-bounty hunters, freelance pentesters. Technical, price-sensitive, self-serve. They already run nmap/ffuf/sqlmap by hand and want leverage, not a black box.

**What makes it different (pick 3 for any surface):**
- A multi-agent team (plan → exploit → report), not a single scan.
- Runs real tools (nmap, metasploit, sqlmap, nuclei…) in an isolated sandbox.
- Bring your own LLM key — your models, your cost, your data.
- Verified-targets-only — built so you (and we) stay on the right side of the law.
- Self-hostable core (MIT, forked from PentAGI) — no lock-in.

---

## 2. Product Hunt launch

**Name:** NullHawk
**Tagline (60 chars max):** `An AI pentest team for targets you own`
**Topics:** Security, Artificial Intelligence, Developer Tools

**Description:**
> NullHawk is an autonomous penetration-testing tool for individual researchers. Verify a target you own, describe the goal in plain language, and a team of AI agents plans the work, runs professional tools (nmap, metasploit, sqlmap, nuclei…) inside an isolated sandbox, remembers what it learns, and hands you a report.
>
> It's built around one rule: no flow runs until you've proven you own the target. Bring your own LLM key to keep costs transparent. The core is open source (MIT).

**Maker's first comment:**
> Hey Product Hunt 👋 I'm building NullHawk because I was tired of babysitting the same recon-and-enumerate loop on every engagement. It's an autonomous AI pentest tool aimed at researchers and bug-bounty hunters — you bring a target you own, it does the grind and writes it up.
>
> The thing I care about most: it's verified-targets-only. You prove ownership (DNS record, file, or IP range) before anything runs. That's a deliberate constraint — hosted offensive tooling that doesn't do this is a liability for everyone.
>
> It's in private beta, bring-your-own-LLM-key, with a free 14-day trial. Would love feedback from anyone in offensive security — especially on the verification flow and what a "good enough" report looks like to you.

---

## 3. Hacker News / r/netsec style post

**Title:** `Show HN: NullHawk – autonomous AI pentesting, verified-targets-only`

**Body:**
> NullHawk is a self-hosted-or-hosted autonomous pentest tool. You describe a target you own and a goal; a team of agents plans tasks, runs tools in a Docker sandbox, stores results in pgvector memory, and reports.
>
> Two design decisions I'd genuinely like feedback on:
> 1. **Verified-targets-only.** Every target must pass ownership verification (DNS-TXT / file / IP range) before a flow can run. For a hosted offensive tool this felt non-negotiable — curious if people think it's too strict or not strict enough.
> 2. **Bring-your-own-LLM-key.** Keys stay in your tenant; you see exactly what you spend. Avoids us becoming a markup reseller of tokens.
>
> It's a customized fork of the open-source PentAGI (MIT). Honest status: private beta, some of the multi-tenant isolation is still being built. Not affiliated with the upstream project.
>
> Happy to answer anything about the architecture, the agent loop, or the sandbox model.

*(Keep HN/Reddit honest and low-hype. These communities punish marketing speak and reward real technical detail + admitting what's unfinished.)*

---

## 4. X / Twitter launch thread

1/ I built an AI pentest team you point at your own targets. It plans, runs the tools, and writes the report. Meet NullHawk 🦅 Private beta open 👇

2/ The loop every researcher knows: recon → enumerate → find the thing → write it up. NullHawk's agents do the grind inside an isolated sandbox with real tools (nmap, metasploit, sqlmap, nuclei…). You stay in the loop; it does the typing.

3/ The rule it won't break: no flow runs until you've proven you own the target. DNS record, file, or IP range. Hosted offensive tooling without this is a lawsuit waiting to happen — so it's feature #1, not an afterthought.

4/ Bring your own LLM key. Your models, your bill, your data. No token markup, no mystery costs.

5/ Core is open source (MIT, forked from PentAGI). Self-host it, or use the hosted beta. Free 14-day trial, €39/mo after.

6/ Authorized testing only. If you hunt bugs or run engagements on scope you control, I'd love your feedback. Request access: [link] 🦅

---

## 5. LinkedIn post

> I'm launching NullHawk — an autonomous pentest tool for security researchers.
>
> You verify a target you own, describe the objective in plain language, and a team of AI agents plans the work, runs professional tooling in an isolated sandbox, and delivers a report with severity and reproduction steps.
>
> One principle shaped the whole product: it won't touch a target until you've proven it's yours. For hosted offensive tooling, that's the only responsible default.
>
> Built on the open-source PentAGI (MIT), bring-your-own-LLM-key, private beta now. If you work in offensive security or bug bounty, I'd value your eyes on it. Link in comments.

---

## 6. Cold DM / email to a researcher (short)

> Subject: an AI that does your recon grind (for targets you own)
>
> Hi [name] — saw your work on [program/writeup]. I'm building NullHawk, an autonomous pentest tool for researchers: verify a target you own, give it a goal, and it runs the tools and writes up findings. BYO LLM key, verified-targets-only.
>
> It's in private beta and I'm looking for a handful of real hunters to break it and tell me what's missing. 14-day free trial, no card. Want in? — [you]

*(Only send to people whose public work shows they do authorized testing. Never imply it's for attacking third parties.)*

---

## 7. Pre-launch waitlist copy

**Headline:** `Your AI pentest team. On your infra.`
**Sub:** `NullHawk runs autonomous pentests against targets you own — plan, exploit, report. Private beta.`
**CTA button:** `Request beta access`
**Under-CTA microcopy:** `Authorized testing only. Every target is ownership-verified before a flow runs.`

---

## 8. Channels to seed (individual-researcher ICP)

- Bug-bounty Discords/Slacks (share as a member, not a billboard — lead with the verification + BYO-key angle).
- r/netsec, r/bugbounty (Show-HN tone; expect scrutiny — answer technically).
- Infosec X/Twitter; tag no one, let the thread do the work.
- Hacker-oriented newsletters (tldr sec, etc.) — pitch the verified-targets design as the story.
- A short demo video of one real flow end-to-end (recon → verified SQLi → report) is worth more than any copy here.

---

## Guardrails for all marketing

- Never market or imply use against third parties or without authorization.
- Always pair the capability with the constraint (verified targets, authorized only).
- Don't claim compliance/certifications you don't have.
- Keep upstream attribution: "built on PentAGI (MIT)", not "we wrote this from scratch".
- Under-promise on beta features; say what's live vs. coming.
