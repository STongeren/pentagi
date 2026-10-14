> **DRAFT — NOT LEGAL ADVICE.** Generated as a starting point. Have a qualified technology/cybersecurity lawyer in your jurisdiction review and finalize before relying on or publishing this.

# NullHawk Privacy Policy

**Last updated:** [DATE] · **Version:** Draft 0.1

This Privacy Policy explains how [Company Legal Name] ("**NullHawk**," "**we**," "**us**") collects, uses, shares, and protects personal data when you use the NullHawk service (the "**Service**"). It is written to be aware of the EU/UK General Data Protection Regulation ("**GDPR**") and similar laws. For personal data processed in connection with your use of the Service, NullHawk acts as a **controller** unless stated otherwise.

**[PLACEHOLDER — add a jurisdiction-specific addendum (e.g., CCPA/CPRA for California residents) after legal review. Do not publish without a named company entity and a valid contact.]**

---

## 1. Who We Are

[Company Legal Name] operates NullHawk. For privacy questions, contact us at **[privacy@nullhawk.example]**. Our Data Protection Officer / privacy contact is **[DPO name / role — PLACEHOLDER]** at **[dpo@nullhawk.example]**. If an EU/UK representative is required, that representative is **[PLACEHOLDER]**. We do not list a physical address here; add your registered address after legal review.

---

## 2. Data We Collect

| Category | Examples | Source |
|---|---|---|
| **Account data** | Name/handle, email address, authentication identifiers, OAuth profile (Google/GitHub), password hash, API tokens, MFA settings | You; identity providers |
| **Billing data** | Plan/tier, subscription status, transaction records, partial card data (e.g., last four digits, brand), billing country | You; our payment processor |
| **Target-verification records** | Target identifiers (domains/hosts/IPs), verification method and proof, attestations of ownership/authorization, timestamps | You; verification checks |
| **Usage and flow metadata** | Flows, tasks, agent/tool invocations, logs, configuration, timestamps, feature usage, rate-limit counters | The Service |
| **Scan content and output** | Commands, tool output, findings, reports, artifacts you generate (may incidentally include personal data present on targets you own/are authorized to test) | The Service, under your direction |
| **Technical/device data** | IP address, browser/user-agent, device identifiers, approximate location derived from IP, cookies/session tokens | Automatically |
| **Support and communications** | Messages to support, abuse reports, correspondence | You; third parties reporting abuse |

We do not intentionally seek special-category personal data. Do not submit sensitive personal data except as strictly necessary, and only where you are lawfully entitled to process it.

---

## 3. How and Why We Use Data (Legal Bases)

| Purpose | Legal basis (GDPR Art. 6) |
|---|---|
| Provide, operate, and secure the Service; run flows you initiate | Performance of a contract (Art. 6(1)(b)) |
| Account creation, authentication, and support | Performance of a contract (Art. 6(1)(b)) |
| Billing, subscription management, auto-renewal, tax/accounting | Contract (Art. 6(1)(b)); legal obligation (Art. 6(1)(c)) |
| Target-ownership verification and abuse prevention | Legitimate interests (Art. 6(1)(f)) — preventing misuse of offensive tooling; legal obligation where applicable |
| Security, fraud prevention, logging, and incident response | Legitimate interests (Art. 6(1)(f)); legal obligation (Art. 6(1)(c)) |
| Service improvement and analytics (aggregated/limited) | Legitimate interests (Art. 6(1)(f)) |
| Marketing communications (if any) | Consent (Art. 6(1)(a)); you may withdraw at any time |
| Responding to legal requests; cooperating with authorities | Legal obligation (Art. 6(1)(c)); legitimate interests (Art. 6(1)(f)) |

Where we rely on legitimate interests, we balance those interests against your rights; you may object as described in Section 8. Given the nature of the Service (autonomous offensive-security tooling), abuse prevention, target verification, and security logging are core legitimate interests.

---

## 4. LLM Processing and the BYO-Key Option

The Service uses large-language-model ("LLM") providers to power its agents. Depending on your configuration, prompts and related content may be sent to an LLM provider to generate results.

- **Bring-your-own-key (BYO-key).** If you configure your own LLM provider API key, your prompts and content are sent directly to that provider under **your** account and **your** agreement with them; that provider's processing is governed by **your** relationship with them, and for that processing you (not NullHawk) are responsible for the arrangement with the provider.
- **NullHawk-provided LLM access.** If you use LLM capacity we provide, we act as controller/processor as applicable and engage the relevant provider as a sub-processor (Section 6).

We seek to minimize the personal data sent to LLM providers and configure providers to limit training on your data where that option is available, but we do not control a provider's independent practices. Review the applicable provider's terms.

---

## 5. Retention

We keep personal data only as long as necessary for the purposes above:

- **Account data** — for the life of your account and a reasonable period after closure.
- **Billing records** — as required by tax/accounting law (commonly up to [7] years).
- **Target-verification records and security logs** — retained for an abuse-prevention and legal-defense period of **[12–24 months — PLACEHOLDER]**, which may be extended under legal hold.
- **Flow/scan content and output** — retained per your plan settings; you may delete flows, subject to backups and logs that age out on our standard cycle.

Exact retention periods are a **[PLACEHOLDER — set and justify after legal review].** We may retain limited data longer where required by law or to establish, exercise, or defend legal claims.

---

## 6. Sharing and Sub-Processors

We do not sell personal data. We share it with service providers ("sub-processors") that process it on our behalf under appropriate contractual safeguards (including GDPR Art. 28 data-processing agreements). Representative categories:

| Sub-processor (example) | Purpose |
|---|---|
| **Payment processor (e.g., Stripe)** | Billing and payment processing |
| **LLM providers** (e.g., OpenAI, Anthropic, Google, and others per your configuration) | Agent reasoning/generation — note the **BYO-key** option in Section 4 |
| **Cloud hosting / infrastructure provider** [PLACEHOLDER] | Hosting, compute, sandbox execution, storage |
| **Email / communications provider** [PLACEHOLDER] | Transactional email, support |
| **Analytics / observability provider** [PLACEHOLDER] | Service monitoring and reliability |

A current list of sub-processors is available at **[PLACEHOLDER — sub-processor list URL]**. We may also disclose data (a) to comply with law or valid legal process; (b) to enforce our Terms and AUP, investigate abuse, or protect rights, safety, and property — including, where warranted, cooperation with law enforcement as described in the AUP; and (c) in a merger, acquisition, or asset sale, subject to this Policy.

---

## 7. International Transfers

We may process and store personal data in countries other than yours. Where we transfer personal data out of the EEA, UK, or Switzerland to a country without an adequacy decision, we use appropriate safeguards such as the European Commission's **Standard Contractual Clauses** (and the UK International Data Transfer Addendum), together with supplementary measures as needed. You may request information about these safeguards at [privacy@nullhawk.example].

---

## 8. Your Rights

Subject to applicable law, you may have the right to: **access** your personal data; **rectify** inaccurate data; **erase** data ("right to be forgotten"); **restrict** or **object** to certain processing (including processing based on legitimate interests and direct marketing); **data portability**; and to **withdraw consent** where processing is based on consent. You may also lodge a complaint with your supervisory authority (in the EEA/UK).

To exercise a right, contact **[privacy@nullhawk.example]**. We will verify your identity and respond within the legally required timeframe (generally one month under GDPR). Some data may be retained where we have an overriding legal obligation or legitimate ground (for example, security logs and target-verification records needed to prevent or investigate misuse, or records needed to defend legal claims).

---

## 9. Cookies and Tracking

We use strictly necessary cookies/session tokens to operate the Service (e.g., authentication). Any non-essential analytics cookies are used only with your consent where required, and you can decline them. See our cookie notice **[PLACEHOLDER]** for details.

---

## 10. Security

We implement technical and organizational measures appropriate to the risk, including encryption in transit, access controls, sandbox isolation of agent execution, logging, and secret-masking of credentials in logs and transcripts. No system is perfectly secure; we cannot guarantee absolute security. We will notify affected users and authorities of a personal-data breach where required by law.

---

## 11. Children

The Service is not directed to anyone under 18, and we do not knowingly collect personal data from minors. If you believe a minor has provided data, contact [privacy@nullhawk.example] and we will delete it.

---

## 12. Changes to this Policy

We may update this Policy. We will post the new version with an updated date and, for material changes, provide additional notice. Continued use after the effective date constitutes acceptance where permitted by law.

---

**Contact:** [privacy@nullhawk.example] · DPO/privacy contact: [dpo@nullhawk.example]
