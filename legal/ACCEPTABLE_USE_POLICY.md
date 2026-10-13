> **DRAFT — NOT LEGAL ADVICE.** Generated as a starting point. Have a qualified technology/cybersecurity lawyer in your jurisdiction review and finalize before relying on or publishing this.

# NullHawk Acceptable Use Policy

**Last updated:** [DATE] · **Version:** Draft 0.1

This Acceptable Use Policy ("**AUP**") governs your use of the NullHawk service, agents, tooling, and output (the "**Service**") operated by [Company Legal Name] ("**NullHawk**," "**we**," "**us**"). It is incorporated into, and is a material part of, the [Terms of Service](./TERMS_OF_SERVICE.md). **If any other document conflicts with this AUP on what is permitted, this AUP controls.**

NullHawk runs autonomous AI agents that execute **real** penetration-testing tools (for example nmap, metasploit, sqlmap) against the targets you designate. These tools can disrupt, damage, or gain unauthorized access to computer systems. Running them against a system you are not authorized to test is illegal in most jurisdictions and can constitute a serious criminal offense. **Read this AUP carefully. You are solely and personally responsible for every operation you initiate.**

---

## 1. The Core Rule: Authorized Testing Only

**You may use the Service only against systems that you own, or for which you hold explicit, current, written authorization from the person or organization that owns or lawfully controls them.** There are no exceptions to this rule. "Authorization" means a genuine, documented right to perform active security testing — not an assumption, not an implied invitation, and not the mere fact that a system is reachable over the internet.

By initiating any scan, probe, exploit, or other operation, you represent and warrant, for every target, that:

1. You own the target system, **or** you possess explicit written authorization to test it that is in force at the time of testing;
2. Your authorization covers the specific scope, techniques, and intensity of the testing you perform (including active exploitation, where applicable);
3. The testing does not violate any law, regulation, contract, or third-party right; and
4. You will retain evidence of that authorization and produce it to us on request.

If you participate in a bug-bounty or vulnerability-disclosure program, you must stay **strictly within the published scope and rules** of that program. Out-of-scope targets, prohibited techniques, and prohibited data handling under a program's rules are also prohibited here.

---

## 2. Mandatory Target-Ownership Verification

2.1 Before the Service will run any active operation against a target, you must complete our **target-ownership/authorization verification** for that target (for example, via DNS record, file placement, header challenge, or acceptance of a signed authorization attestation — the exact methods are described in-product).

2.2 Verification is a **technical control to reduce accidental misuse. It is not a legal authorization and it does not transfer any right to you.** Passing verification does not make your testing lawful and does not reduce your sole responsibility under Section 1.

2.3 You must not attempt to bypass, spoof, falsify, automate around, or otherwise circumvent verification, nor verify a target you do not actually own or control. Doing so is a serious violation of this AUP and may be a crime.

2.4 We may re-verify, expire verifications, require re-attestation, or refuse verification at any time at our discretion.

---

## 3. Prohibited Targets

You must **not** direct the Service at, and must not attempt to verify, any of the following, regardless of any claimed authorization, unless you are the lawful owner/operator and all applicable law permits it:

- **Third-party systems** you neither own nor have explicit written permission to test — including other people's websites, accounts, devices, cloud tenants, SaaS instances, APIs, or networks.
- **Shared or multi-tenant infrastructure** where your test could reach systems or data belonging to others (e.g., a shared hosting provider, a cloud control plane, a CDN) without the provider's and co-tenants' authorization.
- **Government, military, law-enforcement, or public-sector systems**, and election infrastructure.
- **Critical infrastructure** — including power, water, energy, telecommunications, transportation, financial-market, industrial-control/SCADA/OT, and emergency-services systems.
- **Healthcare and safety-of-life systems** — hospital, medical-device, or clinical systems, and any system whose disruption could endanger human health or life.
- **Systems of minors**, or systems whose testing would expose the personal data of individuals who have not consented.
- Any target where testing would **violate applicable law**, a court order, sanctions/embargo, or a contractual prohibition.

When in doubt, do not test. Reachability is never authorization.

---

## 4. Prohibited Uses

You must not use the Service, its agents, its tooling, or any Output to:

1. **Conduct an actual attack** — gain, maintain, or escalate unauthorized access to, or control over, any system you are not authorized to test.
2. **Exfiltrate, copy, or retain data** from systems you do not own or are not authorized to test, including credentials, personal data, trade secrets, or regulated data.
3. **Cause denial of service** — launch DoS/DDoS, volumetric floods, resource-exhaustion, or other availability-impacting attacks outside an owned/authorized environment and scope.
4. **Deploy, weaponize, or operationalize Output against third parties** — use findings, payloads, exploits, or artifacts the Service produces to attack, extort, or compromise systems you are not authorized to test.
5. **Develop, host, or distribute malware, ransomware, botnets, or command-and-control** infrastructure for malicious use.
6. **Harass, surveil, stalk, dox, or harm** any person, or facilitate any such activity.
7. **Defraud, extort, or steal**, including unauthorized access for financial gain.
8. **Evade, disable, or interfere** with security controls, logging, or monitoring of systems you are not authorized to test, or circumvent the Service's own sandboxing, verification, or rate limits.
9. **Infringe intellectual property** or misappropriate confidential information.
10. **Violate export-control or sanctions law** (see the [EULA](./EULA.md)), or use the Service in or for an embargoed destination or restricted party.
11. **Resell, sublicense, or provide the Service "as a service" to others**, or use it to test targets on behalf of a third party, except as expressly permitted in writing by us and only where you hold proper authorization for each target.
12. **Interfere with the Service itself**, other users, or our infrastructure, or use the Service to attack us.

---

## 5. Your Sole Responsibility and Liability

5.1 **You are solely responsible and liable** for every operation you initiate through the Service, for selecting and authorizing targets, for staying within scope, and for all consequences of your testing.

5.2 The Service is a tool you direct. **We do not review, approve, or endorse your targets or testing, and verification does not make us a party to, or authorizer of, your testing.** Any automation or autonomy of the agents operates under your direction and on targets you designate and verify.

5.3 You agree to **defend and indemnify** us for claims arising from your use of the Service, as set out in the Terms of Service. You acknowledge that misuse may expose **you** to civil liability and criminal prosecution under computer-misuse laws (for example, in various jurisdictions, laws comparable to the U.S. Computer Fraud and Abuse Act or the UK Computer Misuse Act).

---

## 6. Reporting Abuse

If you believe the Service is being misused, or you are the owner of a system that has been tested without your authorization, contact us immediately at **[abuse@nullhawk.example]** with relevant details (timestamps, source indicators, target identifiers). We investigate credible reports and take appropriate action. Reports made in good faith are welcome; do not submit another party's personal data beyond what is necessary to describe the abuse.

---

## 7. Enforcement and Consequences

7.1 We may, at our discretion and without prior notice, **suspend or permanently terminate** your access, cancel in-flight operations, revoke target verifications, and **retain no obligation to refund** any fees, if we reasonably believe you have violated this AUP.

7.2 We may **preserve and disclose** information, including logs, target-verification records, and account data, **to law enforcement and other authorities**, and cooperate with lawful investigations, where we believe in good faith that disclosure is required by law or necessary to prevent harm or respond to unauthorized activity, consistent with the [Privacy Policy](./PRIVACY_POLICY.md).

7.3 We may report serious violations (for example, evidence of unauthorized attacks against third parties or critical infrastructure) to the relevant authorities.

7.4 Enforcement action is in addition to any other remedy available to us at law or under the Terms of Service.

---

## 8. Changes to this AUP

We may update this AUP to reflect new risks, features, or legal requirements. Material changes will be notified as described in the Terms of Service. Continued use after the effective date constitutes acceptance.

---

**Contact:** [abuse@nullhawk.example] · [security@nullhawk.example] · [legal@nullhawk.example]
