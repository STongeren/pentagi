> **DRAFT — NOT LEGAL ADVICE.** Generated as a starting point. Have a qualified technology/cybersecurity lawyer in your jurisdiction review and finalize before relying on or publishing this.

# NullHawk Terms of Service

**Last updated:** [DATE] · **Version:** Draft 0.1

These Terms of Service ("**Terms**") are a binding agreement between you ("**you**," "**your**," or "**Customer**") and [Company Legal Name] ("**NullHawk**," "**we**," "**us**," or "**our**"), governing your access to and use of the NullHawk hosted service, websites, APIs, agents, and related software (collectively, the "**Service**").

By creating an account, clicking "I agree," or using the Service, you accept these Terms. **If you do not agree, do not use the Service.** The Service is a hosted, autonomous security-testing platform that executes real offensive-security tooling; your use is additionally governed by the [Acceptable Use Policy](./ACCEPTABLE_USE_POLICY.md) ("**AUP**") and the [End User License Agreement](./EULA.md) ("**EULA**"), each incorporated here by reference. **If there is a conflict, the AUP controls on matters of permitted use.**

---

## 1. Eligibility and Accounts

1.1 **Age and capacity.** You must be at least 18 years old and able to form a binding contract. The Service is intended for individual security researchers and bug-bounty hunters.

1.2 **Not barred.** You represent that you are not: (a) located in, or a resident or national of, any country or territory subject to comprehensive sanctions or embargo (as administered by, e.g., the U.S. Office of Foreign Assets Control, the EU, or the UK); (b) listed on any applicable restricted-party or denied-persons list; or (c) otherwise barred from receiving the Service under applicable law. See also Section 14 (Export Control) and the EULA.

1.3 **Account security.** You are responsible for safeguarding your credentials and API keys, and for all activity under your account. Notify us immediately at [security@nullhawk.example] of any suspected unauthorized access. We may require multi-factor authentication.

1.4 **One human per account.** Accounts are for a single identified individual. You may not share, resell, or transfer your account without our prior written consent.

1.5 **Accurate information.** You agree to provide accurate registration and billing information and to keep it current.

---

## 2. The Service and Mandatory Target Verification

2.1 **What the Service does.** NullHawk orchestrates autonomous AI agents that run real penetration-testing tools (e.g., nmap, metasploit, sqlmap) inside isolated sandboxes against targets you designate.

2.2 **Authorized testing only.** You may only use the Service against systems that you own or for which you hold explicit, current, written authorization. This is a material condition of these Terms and is detailed in the AUP.

2.3 **Target-ownership verification is mandatory.** Before any scan, exploit, or other active operation runs against a target, you must complete our target-ownership/authorization verification process for that target. We may refuse, delay, or revoke verification at our discretion. Verification is a technical control, not a legal determination; it does not transfer to you any authorization and does not relieve you of sole responsibility for the legality of your testing.

2.4 **No circumvention.** You may not attempt to bypass, spoof, or falsify verification, sandbox isolation, rate limits, or any other technical control.

---

## 3. Subscriptions, Plans, and Billing

3.1 **Plans.** The Service is offered in tiers, which may include:
- **Trial** — a time- or usage-limited free evaluation, offered at our discretion and subject to feature, target, and rate limits.
- **Solo** — an entry paid plan for individual researchers.
- **Pro** — a higher-tier paid plan with expanded limits and features.

Plan features, limits, and prices are described at checkout or on our pricing page and may change prospectively as set out in Section 15.

3.2 **Fees and taxes.** You agree to pay all fees for your selected plan. Fees are exclusive of taxes; you are responsible for all applicable sales, use, VAT, GST, or similar taxes, excluding taxes on our net income.

3.3 **Payment processor.** Payments are processed by a third-party processor (e.g., Stripe). We do not store full payment-card numbers. Your use of payment features is subject to the processor's terms. See the [Privacy Policy](./PRIVACY_POLICY.md).

3.4 **Auto-renewal.** **Paid subscriptions automatically renew** at the end of each billing period (monthly or annual, as selected) at the then-current rate, and your payment method will be charged, **unless you cancel before the renewal date.** You may cancel at any time through your account settings; cancellation takes effect at the end of the current billing period.

3.5 **Refunds.** Except where required by applicable mandatory consumer-protection law, **fees are non-refundable** and we do not provide refunds or credits for partial periods, unused capacity, or downgrades. We may, at our sole discretion, offer a pro-rated or goodwill refund. Trial periods are not refundable because they are free.

3.6 **Price changes.** We may change prices for future billing periods with at least [30] days' notice. Continued use after a price change takes effect constitutes acceptance.

3.7 **Non-payment.** We may suspend or terminate the Service for overdue amounts after reasonable notice.

---

## 4. Acceptable Use

Your use of the Service is governed at all times by the [Acceptable Use Policy](./ACCEPTABLE_USE_POLICY.md). Violation of the AUP is a material breach of these Terms and may result in immediate suspension or termination under Section 6, with no refund.

---

## 5. Service Availability; No SLA for Lower Tiers

5.1 **"As available."** We strive to keep the Service available but do not guarantee uninterrupted or error-free operation. The Service may be unavailable for maintenance, updates, or circumstances beyond our control.

5.2 **No SLA for Trial and Solo.** We provide **no service-level agreement, uptime commitment, or availability credit** for the Trial or Solo tiers. Any SLA, if offered, applies only to the Pro tier (or a separately negotiated enterprise agreement) and only if expressly stated in a written SLA document.

5.3 **Changes to the Service.** We may add, modify, or discontinue features. We will use reasonable efforts to give notice of materially adverse changes to paid tiers.

---

## 6. Suspension and Termination

6.1 **By you.** You may stop using and cancel the Service at any time per Section 3.4.

6.2 **By us for cause.** We may suspend or terminate your access immediately, without refund, if we reasonably believe you have: (a) violated the AUP or these Terms; (b) used the Service against an unauthorized target or for an unlawful purpose; (c) created risk or legal exposure for us, other users, or third parties; or (d) failed to pay.

6.3 **For convenience.** We may terminate or suspend the Service, or your account, for convenience with reasonable notice; in that case we will refund any pre-paid, unused fees on a pro-rata basis unless the termination is for cause.

6.4 **Effect of termination.** Upon termination, your license ends and your right to access the Service ceases. We may delete your data subject to the retention and legal-hold practices described in the Privacy Policy. Sections that by their nature should survive (including 7–13) survive termination.

---

## 7. Intellectual Property

7.1 **Our IP.** The Service, including the NullHawk platform, branding, UI, and our proprietary modifications, is owned by us or our licensors and protected by intellectual-property laws. Except for the limited license in the EULA, no rights are granted to you.

7.2 **Open-source components.** The Service is built on a customized fork of the open-source project **PentAGI**, licensed under the **MIT License**. We retain and comply with the applicable MIT copyright notices and license terms, and such components remain governed by their respective open-source licenses. See the EULA and the repository `LICENSE` file.

7.3 **Your content.** You retain ownership of the targets, configurations, and data you supply ("**Customer Content**"). You grant us a limited license to process Customer Content solely to provide and secure the Service.

7.4 **Output.** Scan results, findings, and reports the Service generates for you ("**Output**") are yours to use **only for lawful, authorized testing**. You are responsible for how you use Output; using Output to attack or exploit systems you are not authorized to test is prohibited (see AUP).

7.5 **Feedback.** If you give us feedback, we may use it without restriction or obligation to you.

---

## 8. Disclaimers of Warranty

THE SERVICE, INCLUDING ALL AGENTS, TOOLING, AND OUTPUT, IS PROVIDED **"AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND**, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE SECURE, UNINTERRUPTED, OR ERROR-FREE, THAT FINDINGS WILL BE ACCURATE OR COMPLETE, OR THAT THE SERVICE WILL DETECT ALL VULNERABILITIES OR AVOID FALSE POSITIVES. AUTONOMOUS SECURITY TOOLING CAN CAUSE SERVICE DISRUPTION, DATA CHANGES, OR OUTAGES ON TARGET SYSTEMS; YOU ASSUME ALL RISK OF RUNNING IT. Some jurisdictions do not allow certain disclaimers, so parts of this section may not apply to you.

---

## 9. Limitation of Liability

9.1 **No indirect damages.** TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY.

9.2 **Liability cap.** TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE WILL NOT EXCEED **THE TOTAL FEES YOU ACTUALLY PAID TO US FOR THE SERVICE IN THE [TWELVE (12)] MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE LIABILITY** (or, for a Trial user who paid nothing, **[USD $100]**).

9.3 **Exceptions.** Some jurisdictions do not allow the exclusion or limitation of certain liabilities (e.g., for death or personal injury caused by negligence, fraud, or gross negligence); those limitations apply only to the extent permitted by law. Nothing in these Terms limits either party's liability where it cannot lawfully be limited.

9.4 **Basis of the bargain.** The disclaimers and limitations in Sections 8 and 9 are a fundamental basis of the bargain and reflect an allocation of risk given the pricing of the Service.

---

## 10. Indemnification

You will defend, indemnify, and hold harmless NullHawk and its officers, directors, employees, and agents from and against any and all claims, damages, losses, liabilities, fines, penalties, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) your use of the Service, including any scan, exploit, or operation you initiate; (b) any target you tested without proper ownership or authorization; (c) your Customer Content or Output; (d) your violation of these Terms, the AUP, the EULA, or any law; or (e) your infringement or misappropriation of any third-party right. We will promptly notify you of the claim, allow you to control the defense (with our right to participate with our own counsel), and reasonably cooperate; you may not settle any claim in a way that imposes obligations on us without our consent.

---

## 11. Third-Party Services

The Service integrates third-party services (e.g., LLM providers, payment processor, cloud host). Those services are governed by their own terms, and we are not responsible for them. Where you use a "bring-your-own-key" (BYO-key) option for an LLM provider, your relationship with that provider is solely between you and them.

---

## 12. Governing Law and Disputes

12.1 **Governing law.** These Terms are governed by the laws of **[Jurisdiction]**, without regard to conflict-of-laws rules.

12.2 **Venue / dispute resolution.** The parties submit to the exclusive jurisdiction of the courts located in **[Jurisdiction / Venue]**, unless a binding arbitration clause is added here after legal review. **[PLACEHOLDER — decide arbitration vs. courts; add class-action waiver if appropriate and enforceable in the chosen jurisdiction.]**

12.3 **Mandatory consumer rights.** If you are a consumer, nothing in this Section deprives you of the protection of mandatory provisions of the law of your country of residence.

---

## 13. Compliance with Law and Export Control

You must use the Service in compliance with all applicable laws, including computer-misuse/anti-hacking laws, data-protection laws, and export-control and sanctions laws. See Section 14 of the EULA for export-control acknowledgments regarding offensive-security tooling.

---

## 14. Export Control

Offensive-security and "intrusion software" tooling may be subject to export-control regulations (including, e.g., the Wassenaar Arrangement, the U.S. Export Administration Regulations, and comparable EU/UK regimes). You are solely responsible for compliance, including not accessing or using the Service in or for the benefit of embargoed destinations or restricted parties. See the EULA.

---

## 15. Changes to These Terms

We may update these Terms from time to time. For material changes, we will provide reasonable notice (e.g., by email or in-product notice) before they take effect. Continued use after the effective date constitutes acceptance. If you do not agree, you must stop using and may cancel the Service.

---

## 16. General

16.1 **Entire agreement.** These Terms, the AUP, the EULA, and the Privacy Policy are the entire agreement between the parties regarding the Service.

16.2 **Severability.** If any provision is unenforceable, the remaining provisions remain in effect, and the unenforceable provision will be modified to the minimum extent necessary.

16.3 **No waiver.** Our failure to enforce a provision is not a waiver.

16.4 **Assignment.** You may not assign these Terms without our consent; we may assign them in connection with a merger, acquisition, or sale of assets.

16.5 **Force majeure.** Neither party is liable for delay or failure due to causes beyond its reasonable control.

16.6 **Notices.** We may give notice by email or in-product. Legal notices to us go to [legal@nullhawk.example].

16.7 **Relationship.** The parties are independent contractors; these Terms create no partnership, agency, or employment relationship.

---

**Contact:** [support@nullhawk.example] · [legal@nullhawk.example]
