> **DRAFT — NOT LEGAL ADVICE.** Generated as a starting point. Have a qualified technology/cybersecurity lawyer in your jurisdiction review and finalize before relying on or publishing this.

# NullHawk Legal Pack (DRAFT)

This directory contains a starting-point set of legal documents for **NullHawk**, a hosted SaaS version of an autonomous AI penetration-testing tool. Every file in this pack is a **draft** and must be reviewed and finalized by a qualified technology/cybersecurity lawyer in the relevant jurisdiction before it is relied upon or published.

## The Model These Documents Assume

- **Product:** NullHawk — a hosted (vendor-operated) SaaS platform whose autonomous AI agents run **real** penetration-testing tools (nmap, metasploit, sqlmap, and similar) inside isolated Docker sandboxes.
- **Customers:** individual security researchers and bug-bounty hunters.
- **Plans:** Trial, Solo, Pro — subscription-based, auto-renewing, processed by a third-party payment processor (e.g., Stripe).
- **Key control:** the product **requires mandatory target-ownership/authorization verification** before any scan or exploit runs, and testing is permitted **only** against systems the user owns or is explicitly authorized in writing to test.
- **Codebase:** a customized fork of the open-source **PentAGI** project, which is **MIT-licensed**; upstream attribution is retained (see the repository `LICENSE`).
- **LLM usage:** supports a **bring-your-own-key (BYO-key)** option as well as vendor-provided LLM access.

Because NullHawk *operates* offensive tooling on the user's behalf (even if the user directs it), the documents are drafted to push responsibility and authorization onto the user, to make "authorized testing only" the central condition of the whole agreement, and to protect the vendor from liability for misuse. They are not a substitute for legal advice tailored to the chosen corporate structure and jurisdiction.

## Contents

| File | What it covers |
|---|---|
| [`TERMS_OF_SERVICE.md`](./TERMS_OF_SERVICE.md) | Master SaaS agreement: eligibility, plans/billing/auto-renewal/refunds, availability (no SLA for lower tiers), suspension/termination, IP, disclaimers, limitation of liability (cap at fees paid), indemnification, governing law, changes. |
| [`ACCEPTABLE_USE_POLICY.md`](./ACCEPTABLE_USE_POLICY.md) | The most important document: authorized-testing-only rule, mandatory target verification, prohibited targets and uses, user sole responsibility, abuse reporting, enforcement, law-enforcement cooperation. |
| [`EULA.md`](./EULA.md) | Software/service license: grant and restrictions, autonomous-tooling risk, MIT/PentAGI attribution, no warranty, export-control acknowledgment (Wassenaar/EAR/EU-UK), termination. |
| [`PRIVACY_POLICY.md`](./PRIVACY_POLICY.md) | GDPR-aware privacy notice: data collected, legal bases, retention, sub-processors (LLM providers incl. BYO-key, Stripe, cloud host), user rights, international transfers, security, DPO contact. |
| `README.md` | This index and the lawyer-review checklist below. |

**Document precedence:** on matters of permitted use, the Acceptable Use Policy controls over the other documents. All four substantive documents are intended to be incorporated into, and read with, one another.

## "LAWYER MUST REVIEW" Checklist (Prioritized)

1. **Operator-of-attack liability (highest priority).** NullHawk *hosts and runs* offensive tooling. Assess the vendor's direct and secondary liability (civil and criminal) if a user attacks a non-authorized target — including aiding/abetting and computer-misuse exposure across every jurisdiction where the vendor operates or has users. Confirm the AUP, verification control, and indemnity actually shift risk, and decide whether additional human review, kill-switches, or scope controls are needed.
2. **Export control / sanctions.** Offensive-security "intrusion software" may be export-controlled (Wassenaar, U.S. EAR, EU/UK dual-use). Review classification, screening (sanctions/denied-party), geofencing, and whether any license is required before offering the Service in given countries.
3. **Verified-target contractual requirement.** Validate that mandatory target-ownership verification plus the user's written-authorization warranties are drafted to be enforceable and evidentially useful, and that passing verification cannot be argued to make the vendor an authorizer of the test.
4. **Limitation-of-liability cap enforceability.** Confirm the "cap at fees paid" and the exclusion of indirect/consequential damages are enforceable in the chosen jurisdiction and for consumer customers (individual researchers may be "consumers"), including any mandatory consumer-protection carve-outs.
5. **Jurisdiction / governing law / dispute resolution.** Fill the `[Jurisdiction]` placeholders; decide courts vs. arbitration and whether a class-action waiver is enforceable; reconcile with mandatory consumer rights for individuals.
6. **GDPR DPA with sub-processors.** Put Art. 28 data-processing agreements in place with every sub-processor (payment processor, LLM providers, cloud host); confirm the legal bases, retention periods, SCCs/UK IDTA for transfers, and the BYO-key controller/processor analysis; publish and maintain the sub-processor list. Add a CCPA/CPRA (and other regional) addendum as needed.
7. **Insurance (recommendation).** Obtain specialist **cyber / tech-E&O / professional-liability** insurance appropriate to operating an autonomous offensive-security platform; confirm the policy does not exclude penetration-testing or "hacking tools," and align the liability cap with coverage.

### Additional items to settle before launch

- Replace every placeholder: `[Company Legal Name]`, `[Jurisdiction]`, `[DATE]`, contact addresses (`@nullhawk.example`), DPO/EU-UK representative, registered address, retention periods, refund specifics, and sub-processor list URL.
- Confirm MIT attribution for PentAGI is retained and correct in the shipped product and `LICENSE`.
- Decide and document the refund/consumer-withdrawal position for individual (consumer) subscribers under applicable law.
- Confirm no real company address or contact is published until verified.

---

*These drafts were generated as a starting point and are not legal advice.*
