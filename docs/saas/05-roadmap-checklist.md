# Roadmap and Implementation Checklist

Sequenced across phases. Each item references the document that specifies it. Items marked **[infra]** are operational, not product code; **[codegen]** require the Go toolchain / live Postgres / pnpm and cannot be verified in this analysis environment; **[fail-closed]** are security invariants that must deny on error.

## Phase 0 — Safety first (days)

- [ ] Set `UPDATE_CHECK_INTERVAL=0` in every tenant env and the control-plane template to stop all outbound traffic to `update.pentagi.com` immediately (`01-remove-phone-home.md`, Option A).
- [ ] Leave `INSTALLATION_ID` / `LICENSE_KEY` empty so no VXControl identity is minted.
- [ ] **[infra]** Decide and secure pentest-egress-permitted hosting; do not launch on vanilla AWS/GCP/Azure (`04-hosting-egress-abuse.md`).
- [ ] Confirm the rebrand to NullHawk is complete in user-facing strings (branch `nullhawk-rebrand`; `CLAUDE.md` already says "NullHawk").

## Phase 1 — Target verification (the blocker for any real traffic)

- [ ] Write migration `backend/migrations/sql/20261013_120000_verified_targets.sql` (`02-target-verification.md` §1).
- [ ] Write `backend/sqlc/models/verified_targets.sql` (§2).
- [ ] Add GraphQL types/enums/mutations/query to `backend/pkg/graph/schema.graphqls` (§3).
- [ ] Build `backend/pkg/targetverify/` with DNS-TXT `VerifyDNSTXT` **[fail-closed]** (§7).
- [ ] Implement resolvers in `backend/pkg/graph/schema.resolvers.go` (§4).
- [ ] **v1 design:** add required `targetId: ID!` to `createFlow` to avoid NL target extraction (§5).
- [ ] Insert the gate in `flowController.CreateFlow` (`backend/pkg/controller/flows.go:276`) **[fail-closed]** AND at both edges (`schema.resolvers.go:70`, `services/flows.go:373`); also guard `putUserInput` (§5).
- [ ] Frontend `frontend/src/features/targets/` + `settings-targets.tsx` + create-flow target picker (§6).
- [ ] **[codegen]** Run sqlc (live Postgres) → gqlgen → swag → `pnpm run graphql:generate`; rebuild binary for embedded migration (§8).
- [ ] Prove the gate denies: unverified target → `CreateFlow` refused via both GraphQL and REST.

## Phase 2 — Abuse controls (ship with, not after, Phase 1)

- [ ] Target denylist (gov/mil/critical infra/private ranges/metadata IP) checked at verification request AND flow start, with DNS re-resolution **[fail-closed]** (`04-hosting-egress-abuse.md`).
- [ ] Append-only `flow_audit` table + migration + sqlc; write `{user_id, target, verified_target_id, egress_ip, ts}` in the `CreateFlow` gate.
- [ ] Register any new credential/token in `Config.GetSecretPatterns()` (`config.go:492`).
- [ ] **[infra]** Dedicated rotatable egress IP pool with owned abuse contacts; egress gateway; `DOCKER_NETWORK` routes sandboxes through it.
- [ ] **[infra]** Abuse monitoring (mailbox, blocklist watch, anomaly alerts) + auto-rotation.
- [ ] Kill switch: per-tenant (pause plan + stop live flows via existing `stopFlow`/abort path) and global (drop egress route).

## Phase 3 — Billing and onboarding

- [ ] Build control-plane service: Stripe Checkout + webhooks (`03-billing-and-onboarding.md`).
- [ ] Tenant provisioning: allocate `TENANT_ID` (regex `^[a-z][a-z0-9_]{0,31}$`), launch per-tenant container, distinct `DATA_DIR`/`DOCKER_PORTS_BASE`/ports, edge routing by subdomain; goose auto-creates the schema on boot.
- [ ] BYO-LLM-key onboarding: collect keys → inject into tenant env → researcher configures models in Settings→Providers. Document the honest limitation: keys are per-tenant env, not per in-process user.
- [ ] Plan tiers Trial/Solo(€39)/Pro(€99) with concurrency caps enforced in `flowController.CreateFlow` using `fc.flows`; add `PLAN_MAX_CONCURRENT_FLOWS` config.
- [ ] Monthly/trial flow quota from `flows` table; billing-state → caps on subscription webhooks.

## Phase 4 — Full phone-home removal (after Phase 1-3 stable)

- [ ] Remove `update.New`/`Run` wiring in `backend/cmd/pentagi/main.go:209-215,237`; delete `backend/pkg/server/update/` (`01-remove-phone-home.md`, Option B).
- [ ] Neutralize/remove GraphQL `versionInfo` (`schema.resolvers.go:2109`), `version_info.go`, resolver `Updates` field (`resolver.go:34`); fix frontend consumer.
- [ ] Remove `InstanceSummary` if unused by `cmd/pentagi/info.go`.
- [ ] Remove config fields + `ensureInstallationID`/`ensureLicenseKey` + `LicenseKey` from `GetSecretPatterns`; drop the `vxcontrol/cloud/sdk` import (keep `anonymizer/patterns` unless `GetSecretPatterns` is refactored).
- [ ] Remove installer cloud paths (`cmd/installer/cloud/`, `checker/updates.go`, `processor/update.go`) + wizard wiring.
- [ ] Update tests: `config_test.go` (`clearConfigEnv`, secret-pattern asserts), `version_info_test.go`, `update_test.go`, `summary_test.go`, installer tests.
- [ ] `go mod tidy` to drop the dependency; clean `.env.example`, `docker-compose.yml`, `backend/docs/config.md`.
- [ ] **[codegen]** Regenerate if schema changed.

## Phase 5 — Hardening and launch

- [ ] Re-verification schedule (`expires_at`) so targets that change hands lose access.
- [ ] Review `DOCKER_INSIDE` stays `false` (host-socket escape risk, `.env.example:338-345`).
- [ ] Legal: EULA/ToS for autonomous testing, acceptable-use, data retention aligned with abuse-response window.
- [ ] Load/abuse drill: confirm kill switch cuts egress fast; confirm audit record ties a complaint back to a flow.

---

## The three highest-risk / highest-effort items

1. **Hosting + owned rotatable egress infrastructure (`04`).** A standing operational and legal commitment that is a hard prerequisite to launch — pentest-permitted hosting, an IP pool whose abuse contact is ours, an egress gateway, monitoring, and rotation. This is not product code and cannot be "finished"; it is run forever.
2. **Target-ownership verification done fail-closed, including target extraction (`02` §5).** The gate itself is straightforward, but turning free-form flow `input` ("scan it") into the set of targets to check is a security boundary; a weak extractor leaks unauthorized attacks. Mitigated by the v1 explicit-`targetId` design, which changes the `createFlow` signature and ripples through codegen and frontend. Plus the whole chain (migration → sqlc → gqlgen → swag → frontend codegen → rebuild for embedded migration) needs a live Postgres and the toolchain, none verifiable here.
3. **Tenant-per-container provisioning + the BYO-key limitation (`00`, `03`).** LLM keys are instance-global env vars (`config.go` + `providerRegistry` `Enabled`), not per-user data — the per-user `providers`/`createProvider` path stores only model config. So the entire BYO-key and isolation story depends on building reliable per-tenant container orchestration (TENANT_ID allocation, port/DATA_DIR/egress-identity assignment, edge routing, key injection, lifecycle). The shared-pool alternative is a deep refactor of config and the provider controller.
