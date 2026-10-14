# NullHawk transactional email templates

Standalone, inline-styled HTML emails (table-based for broad client support, 600px, dark brand header + light body + red CTA). Replace `{{PLACEHOLDERS}}` at send time.

| File | Trigger | Key placeholders |
|---|---|---|
| `01-verify-email.html` | Signup | `{{VERIFY_URL}}` |
| `02-flow-complete.html` | A flow finishes | `{{FLOW_ID}} {{TARGET}} {{OBJECTIVE}} {{CRITICAL}} {{HIGH}} {{MEDIUM}} {{REPORT_URL}}` |
| `03-trial-ending.html` | 3 days before trial end | `{{FLOW_COUNT}} {{TARGET_COUNT}} {{BILLING_URL}}` |
| `04-abuse-warning.html` | Flow blocked on an unverified target | `{{TARGET}} {{VERIFY_URL}} {{SUPPORT_EMAIL}}` |

All include `{{UNSUBSCRIBE_URL}}` in the footer. Web fonts don't load in most email clients, so these fall back to Arial — that's expected. Test in Litmus/Email on Acid before sending.
