# Hosting, Egress, and Abuse Controls

NullHawk generates real attack traffic from Docker sandboxes against customer-verified targets. The hosting and egress story is a legal and operational requirement, not an optimization: mainstream clouds prohibit this.

## Hosting that permits pentest egress

- **Vanilla AWS/GCP/Azure are out.** Their acceptable-use policies forbid outbound scanning/attack traffic; even against your own verified target you risk account termination and you remain the originating operator in their logs.
- **Use providers that explicitly permit security testing egress** (pentest-friendly VPS/bare-metal hosts, or a provider contract that permits it in writing). The egress must come from IP space whose abuse contact is **ours**, so complaints reach us, not an unrelated cloud tenant.
- Keep the **control plane** (Stripe, provisioning, dashboards) on normal infra; only the **sandbox egress** needs the special hosting. The split matters: the control plane never emits attack traffic.

## Dedicated, rotatable egress IPs with abuse contacts

- Each sandbox's outbound traffic leaves through a **controlled egress pool** of dedicated IPs we own/lease, with published, monitored abuse contacts (RIR `abuse-c` / WHOIS).
- **Rotatable**: when an IP gets blocklisted or burned, rotate it out without redeploying tenants.
- In the stack, the sandbox network is configured via the `DOCKER_*` settings (`.env.example:332-371`): `DOCKER_NETWORK`, `DOCKER_PUBLIC_IP` (`DOCKER_PUBLIC_IP=0.0.0.0` default), and the per-flow container creation in `backend/pkg/docker/`. The egress pool is wired at the host/network layer (routing/NAT or an egress gateway per container), with `DOCKER_NETWORK` pointing sandboxes at the network that routes through the egress gateway. This is infrastructure config, not product code, but `backend/pkg/docker/` is where container network attachment is chosen if per-flow egress identity is needed.

## Target denylist (gov/mil/critical infra) — fail-closed, server-side

Even a "verified" target must be refused if it is on a hard denylist (government, military, critical infrastructure, known third-party SaaS the customer cannot actually own, RFC1918/loopback/link-local unless explicitly a lab tier).

- **Where:** the denylist check belongs in the **same gate as verification** — `flowController.CreateFlow` (`backend/pkg/controller/flows.go:276`) and the two resolver/service edges (`backend/pkg/graph/schema.resolvers.go:70`, `backend/pkg/server/services/flows.go:373`) — and also at **verification request time** (`requestTargetVerification` resolver, `02-target-verification.md`) so a denied domain can never even become verified. Fail-closed: deny on any denylist-source error.
- **What to deny:** `.gov`/`.mil` and country equivalents; curated critical-infra ASNs/ranges; cloud-provider metadata endpoints (`169.254.169.254`); private/loopback/link-local ranges; a vendor-maintained blocklist pushed from the control plane to every tenant.
- **Resolution-time recheck:** a hostname that was fine at verification can repoint (DNS rebinding). Re-resolve and re-check the denylist at flow start, not only at verification.

## Rate limits

- **Login throttling already exists** (`CLAUDE.md` Authentication: "Repeated failed logins are throttled" — see `backend/pkg/server/auth/`). Reuse.
- **Flow creation / concurrency caps** enforced in `flowController.CreateFlow` per tier (`03-billing-and-onboarding.md`).
- **Per-target and per-egress-IP traffic shaping** at the network layer to keep any single flow from saturating or getting the egress IP blocklisted.

## Kill switch

- **Per-tenant:** control plane pauses a tenant → reject new `CreateFlow` (plan state) and stop/finish running flows. The controller already supports stopping: `stopFlow`/`finishFlow` mutations (`schema.graphqls:1079-1080`) and the controller's `prepareFlow` abort path (`flows.go:316-353`, each flow holds an `abort`/`cancel`). A tenant-wide kill iterates the tenant's live flows and calls the existing stop path, and sets the plan to paused so nothing new starts.
- **Global:** a control-plane flag that pauses all tenants (e.g. egress pool compromised). Simplest robust form: drop the egress gateway route so no sandbox can reach the internet, plus flip every tenant to paused.
- **Fastest blunt instrument:** stop the egress gateway — instantly cuts all attack traffic while leaving the UI/data up for investigation.

## Logging / audit

- **What must be auditable:** who (user_id/tenant), what target, verification record id proving ownership at flow start, when, from which egress IP, and the outcome. This is the evidence that answers an abuse complaint.
- **Where it already lands:** flows, tasks, subtasks, tool calls, terminal output, and search logs are persisted to Postgres (`backend/sqlc/models/`: `flows.sql`, `tasks.sql`, `toolcalls.sql`, `termlogs.sql`, `searchlogs.sql`); the subscription hub (`backend/pkg/graph/subscriptions/`) streams them live. Add an **immutable audit record at the verification gate**: when `CreateFlow` passes, write `{user_id, target, verified_target_id, egress_ip, ts}` to a new append-only `flow_audit` table (new migration + sqlc file, same pattern as `02-target-verification.md`).
- **Secret hygiene is already handled:** `Config.GetSecretPatterns()` (`backend/pkg/config/config.go:492`) masks credentials out of logs and agent transcripts — keep every new credential (and the verification token if sensitive) registered there.
- **Retention:** keep audit + egress logs long enough to answer complaints (align with the egress provider's abuse-response window); store them outside the tenant container so a paused/retired tenant's evidence survives.

## Abuse monitoring

- Watch the egress abuse mailbox and blocklist status (Spamhaus et al.) for every pool IP; auto-rotate on listing.
- Alert on anomalies: a flow generating far more traffic/hosts than typical, targets resolving into denylisted ranges after verification, repeated verification failures (enumeration).
- Tie an inbound abuse complaint back to a flow via the audit record's egress IP + timestamp.

## Effort / risk

The network/egress layer and the denylist are the highest-risk, highest-effort items here (see roadmap). The product-code hooks (denylist check + audit write in the `CreateFlow` gate, kill via existing stop path) are modest; the **infrastructure** (pentest-permitted hosting, owned rotatable IP pool with abuse handling, egress gateway, monitoring) is a substantial standing operational commitment and a prerequisite to launch, not a nice-to-have.
