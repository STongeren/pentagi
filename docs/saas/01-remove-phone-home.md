# Removing the VXControl "phone-home"

PentAGI ships a cloud integration that periodically reports each installation's state to VXControl's update service (`update.pentagi.com`) and introspects a `LICENSE_KEY` against the VXControl SDK. NullHawk is vendor-hosted and must not leak our fleet's state to a third party, so this must go. There are two levels: a **config-only disable** (safe, reversible, no rebuild) and a **full code removal** (removes the dependency and the risk entirely).

Everything below is verified in the repo.

## What the integration actually is

- **Package `pkg/server/update`** (`backend/pkg/server/update/update.go`). Its doc comment states plainly: "it sends the build that is running and a summary of how the server is set up." It runs as a background goroutine, posts to `pathProductUpdate = "/api/v1/proxy/updates/pentagi/check"` at host `cfg.UpdateServerHost`, and keeps the verdict for the UI version badge. It imports `github.com/vxcontrol/cloud/models` and `github.com/vxcontrol/cloud/sdk`.
- **The payload** is built by `database.GetInstanceSummary` (`backend/pkg/database/summary.go`); `update.go:sendOnce` marshals it and sends `models.ProductUpdateRequest` carrying OS/arch/binary hash/version plus the instance summary (feature flags, configured OAuth providers, enabled default providers, embedding provider). The summary is documented as quantities and closed vocabularies only — no user content — but it is still outbound fleet telemetry.
- **Identity:** `newClient` (`update.go:437`) parses `cfg.InstallationID` as a UUID (hard-fails the whole service if absent/malformed) and attaches `cfg.LicenseKey` via `sdk.WithLicenseKey` after `sdk.IntrospectLicenseKey`.
- **Wiring:** `backend/cmd/pentagi/main.go:209-215` — `update.New(cfg, queries)`; on success `go updates.Run(ctx)`; the service is handed to the router at `main.go:237` (`router.NewRouter(..., updates)`), surfaced through GraphQL `versionInfo` (`backend/pkg/graph/schema.resolvers.go:2109`, field `r.Updates.Status()` at line 2120-2124) and shaped by `backend/pkg/graph/version_info.go`.
- **The installer** has its own, separate cloud client used only during install: `backend/cmd/installer/cloud/client.go` (+ `client_test.go`), `backend/cmd/installer/checker/updates.go`, `backend/cmd/installer/processor/update.go`. These fire only when someone installs; for a hosted SaaS we drive provisioning ourselves, so these are dead weight too.

## Config struct fields involved

In `backend/pkg/config/config.go`:

- `InstallationID string `env:"INSTALLATION_ID"`` (line 32)
- `LicenseKey string `env:"LICENSE_KEY"`` (line 33)
- `UpdateStrategy string `env:"UPDATE_STRATEGY" envDefault:"preview"`` (line 277)
- `UpdateCheckInterval time.Duration `env:"UPDATE_CHECK_INTERVAL" envDefault:"3h"`` (line 279)
- `UpdateServerHost string `env:"UPDATE_SERVER_HOST" envDefault:"update.pentagi.com"`` (line 281)
- `SupportServerHost string `env:"SUPPORT_SERVER_HOST" envDefault:"support.pentagi.com"`` (line 283)

Config-side helpers: `ensureInstallationID` (`config.go:369`) generates/persists a UUID to `<DATA_DIR>/installation_id`; `ensureLicenseKey` (`config.go:394`) introspects the key via `sdk.IntrospectLicenseKey` and blanks it if invalid. `LicenseKey` is also in `GetSecretPatterns()` (`config.go:500`). The VXControl SDK is imported at `config.go:17-18` (`github.com/vxcontrol/cloud/anonymizer/patterns`, `github.com/vxcontrol/cloud/sdk`).

Env vars, from `.env.example`: `INSTALLATION_ID`, `LICENSE_KEY` (lines 22-23), `UPDATE_STRATEGY`, `UPDATE_CHECK_INTERVAL`, `UPDATE_SERVER_HOST`, `SUPPORT_SERVER_HOST` (lines 58-70).

## Option A — safe config-only disable (no rebuild, do this first)

The service disables itself cleanly when the interval is zero. `update.Run` (`update.go:182-190`): `if interval <= 0 { ... status.State = StateDisabled; return }`. So set:

```
UPDATE_CHECK_INTERVAL=0
```

in every tenant's env (and the control-plane template). Result: `update.New` may still build a client, but `Run` returns immediately without a single outbound call; the UI badge reads `disabled`. **No network traffic to `update.pentagi.com` occurs.** Also leave `INSTALLATION_ID`/`LICENSE_KEY` empty so no identity is minted. Note `UPDATE_SERVER_HOST`/`SUPPORT_SERVER_HOST` have hardcoded `envDefault`s pointing at VXControl — an empty env var does **not** blank them, so Option A relies on the interval gate, not on clearing the host.

This is the correct first step: reversible, requires no code change, and can ship immediately.

## Option B — full code removal (removes the dependency and the badge)

Do this once Option A is validated and we want the VXControl SDK gone from the build.

1. **Stop constructing/running the service.** In `backend/cmd/pentagi/main.go:209-215`, delete the `update.New` block and the `go updates.Run(ctx)` call; pass `nil`/drop the argument at `main.go:237` `router.NewRouter(...)`.
2. **Delete the package** `backend/pkg/server/update/` (`update.go`, `update_test.go`).
3. **Neutralize the GraphQL badge.** Either remove `versionInfo`'s dependency on updates or make `VersionInfo` (`schema.resolvers.go:2109-2124`) return only `version.GetBinaryVersion()` with `State = disabled`. `backend/pkg/graph/version_info.go` (`versionInfoFromStatus`, `updateStateFromStatus`) and the `Updates` field on the resolver (`backend/pkg/graph/resolver.go:34`) go too. If the `VersionInfo`/`UpdateState` GraphQL types are removed from `schema.graphqls`, regenerate (see below) and fix the frontend consumer of `versionInfo`.
4. **Remove the payload builder if now unused.** `database.GetInstanceSummary` and `backend/pkg/database/summary.go` (+ `summary_test.go`) — grep shows it is also read by `backend/cmd/pentagi/info.go`; keep the function if `info.go` still wants a local, non-transmitted summary, otherwise delete both.
5. **Config.** Remove `InstallationID`, `LicenseKey`, `UpdateStrategy`, `UpdateCheckInterval`, `UpdateServerHost`, `SupportServerHost` from `config.go`; delete `ensureInstallationID` and `ensureLicenseKey` and their calls (`config.go:363-364`); drop `LicenseKey` from `GetSecretPatterns()`. Remove the two `vxcontrol/cloud` imports from `config.go` **only if** no other code needs `anonymizer/patterns` — grep shows `patterns.Pattern` is the return type of `GetSecretPatterns`, so the `patterns` import stays unless that is refactored; the `sdk` import can go.
6. **Installer cloud paths.** Remove `backend/cmd/installer/cloud/`, `backend/cmd/installer/checker/updates.go`, `backend/cmd/installer/processor/update.go`, and their wiring in `backend/cmd/installer/wizard/` (the update menu rows referenced in `controller/controller.go`, `models/server_settings_form.go`). This is the largest and least urgent piece.
7. **`go.mod`.** Once no file imports `github.com/vxcontrol/cloud/...`, run `go mod tidy` to drop the dependency.
8. **`.env.example` / docker-compose / docs.** Delete the six env vars from `.env.example` (lines 22-23, 58-70), from `docker-compose.yml`, and from `backend/docs/config.md`.

## Tests that reference this integration (must be updated/removed alongside)

- `backend/pkg/server/update/update_test.go` — the package's own tests (deleted in B).
- `backend/pkg/graph/version_info_test.go` — `versionInfoFromStatus`/`updateStateFromStatus`.
- `backend/pkg/config/config_test.go` — line 118 `clearConfigEnv` list includes `INSTALLATION_ID`, `LICENSE_KEY`, `UPDATE_*`; the `GetSecretPatterns` assertions include `License Key`.
- `backend/pkg/database/summary_test.go` — if `GetInstanceSummary` is removed.
- `backend/cmd/installer/cloud/client_test.go`, `backend/cmd/installer/hardening/hardening_test.go`, `backend/pkg/tools/tools_test.go` — grep hits for the cloud hosts/identifiers; review and adjust.

## Regeneration required after Option B

Any `schema.graphqls` change (removing `VersionInfo`/`UpdateState`) requires, per `CLAUDE.md`: from `backend/` run `go run github.com/99designs/gqlgen --config ./gqlgen/gqlgen.yml`, then `swag init -g ../../pkg/server/router.go -o pkg/server/docs/ --parseDependency --parseInternal --parseDepth 2 -d cmd/pentagi`; then from `frontend/` run `pnpm run graphql:generate`. **Needs the Go toolchain; gqlgen/swag/sqlc are not verifiable in this environment.**

## Effort / risk

Option A is minutes and risk-free. Option B is ~1-2 days of careful work; the risk is the ripple through `schema.graphqls` → generated code → frontend `versionInfo` consumer, and the `vxcontrol/cloud/anonymizer/patterns` import that `GetSecretPatterns` still needs. **Recommend shipping Option A immediately and scheduling B after the verification feature lands.**
