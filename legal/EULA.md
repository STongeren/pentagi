> **DRAFT — NOT LEGAL ADVICE.** Generated as a starting point. Have a qualified technology/cybersecurity lawyer in your jurisdiction review and finalize before relying on or publishing this.

# NullHawk End User License Agreement (EULA)

**Last updated:** [DATE] · **Version:** Draft 0.1

This End User License Agreement ("**EULA**") is a binding agreement between you ("**you**," "**Licensee**") and [Company Legal Name] ("**NullHawk**," "**we**," "**us**"). It governs your use of the NullHawk software, hosted agents, client components, APIs, and associated tooling (the "**Software**"), which are provided as part of the hosted NullHawk service (the "**Service**"). This EULA is incorporated into the [Terms of Service](./TERMS_OF_SERVICE.md) and is subject to the [Acceptable Use Policy](./ACCEPTABLE_USE_POLICY.md). By accessing or using the Software, you agree to this EULA.

---

## 1. License Grant

Subject to your continuous compliance with this EULA, the Terms of Service, and the AUP, and to payment of applicable fees, NullHawk grants you a **limited, non-exclusive, non-transferable, non-sublicensable, revocable** license to access and use the Software, solely:

- as hosted and made available by us through the Service;
- for your own internal, lawful security-testing activities; and
- **only against targets you own or are explicitly authorized in writing to test**, and only after completing mandatory target verification, in accordance with the AUP.

This license grants no rights except those expressly stated. All rights not granted are reserved by NullHawk and its licensors.

---

## 2. Restrictions

You must not, and must not permit any third party to:

1. copy, modify, translate, or create derivative works of the Software, except as expressly permitted by an applicable open-source license (see Section 4);
2. reverse engineer, decompile, or disassemble the Software, or attempt to derive source code, except to the extent this restriction is prohibited by applicable law or permitted by an applicable open-source license;
3. rent, lease, lend, sell, sublicense, distribute, or provide the Software or Service to a third party, or operate it as a service bureau on behalf of others, except as expressly permitted in writing;
4. remove, alter, or obscure any proprietary notices, or the open-source attribution and license notices described in Section 4;
5. circumvent or disable the Software's security, sandboxing, target-verification, licensing, rate-limiting, or usage-metering features;
6. use the Software to build or train a competing product, or to benchmark it for a competitor;
7. use the Software other than for lawful, authorized security testing, or in any manner prohibited by the AUP or applicable law.

---

## 3. Autonomous Tooling; Assumption of Risk

The Software orchestrates autonomous agents that execute real offensive-security tools inside isolated sandboxes against the targets you designate. You understand and accept that such tools can disrupt, alter, or damage target systems and data, and that the agents may act without step-by-step confirmation within the scope you set. **You direct and control this use, you select and authorize the targets, and you assume all risk** arising from the operations you initiate. The Software is a tool; you are the operator and the responsible party.

---

## 4. Open-Source Components and Attribution (PentAGI / MIT)

4.1 The Software is built on a customized fork of the open-source project **PentAGI**, which is licensed under the **MIT License**. The NullHawk Service and its proprietary modifications are built on top of, and distributed together with, those MIT-licensed components.

4.2 The MIT-licensed components remain governed by the MIT License, not by this EULA, to the extent of any conflict regarding those components. We **retain the original MIT copyright notice and permission notice** as required by that license (see the repository `LICENSE` file), and your use of those components is subject to the MIT License terms. Nothing in this EULA removes or limits any right granted to you directly under the MIT License for those components.

4.3 Other third-party and open-source components may be included; their notices and licenses, where applicable, are provided with the Software or in our documentation. You must comply with those licenses.

4.4 For clarity, NullHawk's proprietary components, branding, and hosted platform are **not** MIT-licensed and are licensed only as set out in Section 1.

---

## 5. No Warranty

THE SOFTWARE IS PROVIDED **"AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND**, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SOFTWARE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, THAT IT WILL IDENTIFY ALL VULNERABILITIES, OR THAT RESULTS WILL BE ACCURATE OR COMPLETE. MIT-LICENSED COMPONENTS ARE ALSO PROVIDED WITHOUT WARRANTY, AS STATED IN THE MIT LICENSE. Your exclusive remedies and our liability are limited as set out in the Terms of Service.

---

## 6. Export Control and Sanctions

6.1 **Offensive-security and "intrusion software" tooling may be subject to export-control laws and regulations**, including (without limitation) the **Wassenaar Arrangement** controls on intrusion software and related technology, the **U.S. Export Administration Regulations (EAR)**, and comparable **EU and UK** export-control and dual-use regimes.

6.2 **You are solely responsible for complying with all applicable export-control, import, and sanctions laws** in connection with your access to and use of the Software, including obtaining any required licenses or authorizations.

6.3 You represent and warrant that you are **not** located in, under the control of, or a national or resident of, any country or territory subject to comprehensive sanctions or embargo, and that you are **not** on any applicable restricted-party, denied-persons, or sanctioned-party list. You must not export, re-export, transfer, or make the Software (or its direct products) available to any such destination or person, or use it for any end-use prohibited by applicable law (including prohibited cyber-surveillance or weapons end-uses).

6.4 You must not use the Software in a manner that would cause NullHawk to violate export-control or sanctions law.

---

## 7. Updates

We may provide updates, patches, or new versions of the Software, and may modify or discontinue features. This EULA governs all such updates unless accompanied by separate terms.

---

## 8. Term and Termination

8.1 This EULA is effective until terminated. It terminates automatically if you breach it, the Terms of Service, or the AUP, and it ends when your access to the Service ends.

8.2 Upon termination, your license under Section 1 ceases immediately and you must stop using the Software. Sections that by their nature should survive (including 2, 3, 4.2, 5, 6, 9, and 10) survive termination.

8.3 Termination of this EULA does not terminate your rights, if any, under the MIT License for the MIT-licensed components themselves.

---

## 9. U.S. Government End Users

If you are a U.S. Government end user, the Software is "commercial computer software" and "commercial computer software documentation," and is provided with only those rights granted to all other end users under this EULA, consistent with FAR 12.212 and DFARS 227.7202, as applicable.

---

## 10. General

This EULA is governed by the law and dispute-resolution provisions of the Terms of Service (**governing law: [Jurisdiction]**). If any provision is unenforceable, the remainder stays in effect. This EULA, together with the Terms of Service, AUP, and Privacy Policy, is the entire agreement regarding the Software.

---

**Contact:** [legal@nullhawk.example] · [support@nullhawk.example]
