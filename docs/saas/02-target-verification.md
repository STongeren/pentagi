# Mandatory Target-Ownership Verification

This is the non-negotiable feature. No flow may run against a target the customer has not proven they control. Cloud providers ban outbound attack traffic to unconsented targets; without verification the vendor becomes the legal operator of an unauthorized attack. The gate must be **fail-closed** and enforced server-side, in the one code path every flow goes through.

The design: a new `verified_targets` table, sqlc queries, GraphQL types + mutations, a resolver, a verification worker (DNS-TXT first), and a gating check inserted into the flow-creation path. DNS-TXT is the first method because it proves control of a domain with no inbound connection to the target and no third party.

All anchor points below are verified in the repo.

## 1. Goose migration — the `verified_targets` table

New file `backend/migrations/sql/20261013_120000_verified_targets.sql`. Follow the shape of `backend/migrations/sql/20260218_150000_api_tokens.sql` (enum + table + indexes + `update_modified_column` trigger + privileges + `-- +goose Down`). Migrations are embedded and run by goose at startup, so this needs a **rebuild**, not just a restart (`CLAUDE.md`, Architecture).

```sql
-- +goose Up
-- +goose StatementBegin
CREATE TYPE TARGET_VERIFICATION_METHOD AS ENUM ('dns_txt', 'http_file', 'email');
CREATE TYPE TARGET_VERIFICATION_STATUS AS ENUM ('pending', 'verified', 'failed', 'revoked', 'expired');

CREATE TABLE verified_targets (
  id            BIGINT                      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id       BIGINT                      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target        TEXT                        NOT NULL,          -- normalized registrable domain / host
  method        TARGET_VERIFICATION_METHOD  NOT NULL DEFAULT 'dns_txt',
  token         TEXT                        NOT NULL,          -- the challenge value to publish
  status        TARGET_VERIFICATION_STATUS  NOT NULL DEFAULT 'pending',
  last_error    TEXT                        NULL,
  verified_at   TIMESTAMPTZ                 NULL,
  expires_at    TIMESTAMPTZ                 NULL,              -- re-verify periodically
  created_at    TIMESTAMPTZ                 DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ                 DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMPTZ                 NULL
);

CREATE UNIQUE INDEX verified_targets_user_target_unique_idx
  ON verified_targets(user_id, target) WHERE deleted_at IS NULL;
CREATE INDEX verified_targets_user_id_idx ON verified_targets(user_id);
CREATE INDEX verified_targets_status_idx ON verified_targets(status);

CREATE TRIGGER update_verified_targets_modified
  BEFORE UPDATE ON verified_targets
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

INSERT INTO privileges (role_id, name) VALUES
  (1,'targets.view'),(1,'targets.create'),(1,'targets.verify'),(1,'targets.delete'),(1,'targets.admin'),
  (2,'targets.view'),(2,'targets.create'),(2,'targets.verify'),(2,'targets.delete')
  ON CONFLICT DO NOTHING;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM privileges WHERE name IN
  ('targets.view','targets.create','targets.verify','targets.delete','targets.admin');
DROP TABLE IF EXISTS verified_targets;
DROP TYPE IF EXISTS TARGET_VERIFICATION_STATUS;
DROP TYPE IF EXISTS TARGET_VERIFICATION_METHOD;
-- +goose StatementEnd
```

The table is user-scoped (`user_id`), and tenant isolation is the schema the whole DB lives in (`Config.SchemaName()`), matching how every other table is isolated. The privilege rows mirror the `api_tokens` migration's `settings.tokens.*` pattern so `auth.PrivilegesRequired` works unchanged.

## 2. sqlc query file

New file `backend/sqlc/models/verified_targets.sql`, modeled on `backend/sqlc/models/api_tokens.sql`. Running `sqlc generate` (from `backend/sqlc/`, needs a **live Postgres** in `DATABASE_URL`) writes `backend/pkg/database/verified_targets.sql.go` and adds the methods to `backend/pkg/database/querier.go`.

```sql
-- name: CreateVerifiedTarget :one
INSERT INTO verified_targets (user_id, target, method, token, status)
VALUES ($1, $2, $3, $4, 'pending') RETURNING *;

-- name: GetUserVerifiedTarget :one
SELECT * FROM verified_targets
WHERE user_id = $1 AND target = $2 AND deleted_at IS NULL;

-- name: GetUserVerifiedTargets :many
SELECT * FROM verified_targets
WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC;

-- name: MarkVerifiedTargetVerified :one
UPDATE verified_targets
SET status = 'verified', verified_at = CURRENT_TIMESTAMP, expires_at = $3, last_error = NULL
WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING *;

-- name: MarkVerifiedTargetFailed :one
UPDATE verified_targets
SET status = 'failed', last_error = $3
WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING *;

-- name: CountActiveVerifiedTargetForUser :one
SELECT COUNT(*) FROM verified_targets
WHERE user_id = $1 AND target = $2 AND status = 'verified' AND deleted_at IS NULL
  AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP);
```

`CountActiveVerifiedTargetForUser` is the one the gate calls — it returns `> 0` only for a currently-verified, non-expired target owned by that user.

## 3. GraphQL schema additions

Edit `backend/pkg/graph/schema.graphqls`. Add types near the other domain types, enums beside the existing enum block, and the mutations/query inside the existing `type Mutation {` (line 1075) / `type Query {` blocks. Per `CLAUDE.md`'s schema rules: no triple-quoted descriptions, names carry the meaning, a single `#` group header is allowed.

```graphql
enum TargetVerificationMethod { dns_txt http_file email }
enum TargetVerificationStatus { pending verified failed revoked expired }

type VerifiedTarget {
  id: ID!
  target: String!
  method: TargetVerificationMethod!
  token: String!
  status: TargetVerificationStatus!
  lastError: String
  verifiedAt: Time
  expiresAt: Time
  createdAt: Time!
  updatedAt: Time!
}

# inside type Query
verifiedTargets: [VerifiedTarget!]!

# inside type Mutation, under a "# Target verification" group header
requestTargetVerification(target: String!, method: TargetVerificationMethod!): VerifiedTarget!
checkTargetVerification(id: ID!): VerifiedTarget!
deleteVerifiedTarget(id: ID!): ResultType!
```

`requestTargetVerification` creates the row with a freshly generated `token` and returns the challenge to publish. `checkTargetVerification` runs the verification worker synchronously and returns the updated row. A `verifiedTargetUpdated` subscription can be added later beside the existing flow subscriptions (`schema.graphqls:1125`) but is not required for v1.

## 4. Resolvers

gqlgen writes stubs into `backend/pkg/graph/schema.resolvers.go` (where `CreateFlow` lives at line 35). Implement the three mutations + query mirroring the permission/validation pattern already used there:

```go
func (r *mutationResolver) RequestTargetVerification(ctx context.Context, target string, method model.TargetVerificationMethod) (*model.VerifiedTarget, error) {
    uid, _, err := validatePermission(ctx, "targets.create")
    if err != nil { return nil, err }
    norm, err := normalizeTarget(target)        // registrable domain, lowercase, reject IPs/wildcards for dns_txt
    if err != nil { return nil, err }
    token := "nullhawk-verify=" + randToken()    // the TXT value to publish
    row, err := r.DB.CreateVerifiedTarget(ctx, database.CreateVerifiedTargetParams{
        UserID: uid, Target: norm, Method: methodToDB(method), Token: token,
    })
    ...
}
```

`checkTargetVerification` loads the row, dispatches on `method`, and on success calls `MarkVerifiedTargetVerified` (set `expires_at` to e.g. now+90d), else `MarkVerifiedTargetFailed` with the reason.

## 5. The gate — inserted into the flow-creation path

Every flow is created through exactly one controller entry point: `flowController.CreateFlow` in `backend/pkg/controller/flows.go:276`. It is called from both front doors:

- GraphQL: `mutationResolver.CreateFlow` (`backend/pkg/graph/schema.resolvers.go:70`) → `r.Controller.CreateFlow(...)`
- REST: `FlowService.CreateFlow` (`backend/pkg/server/services/flows.go:373`) → `s.fc.CreateFlow(...)`

There is a second entry worth gating: `PutUserInput` (`schema.resolvers.go:92`) lets a user add input to an existing flow — it should carry the same check if new targets can appear mid-flow.

**Put the gate at the earliest shared point that fails closed and returns a clean error to the user.** Two viable layers:

1. **Resolver/service layer (recommended for the clear error message):** in both `schema.resolvers.go:CreateFlow` and `services/flows.go:CreateFlow`, after validating the input and before calling `r.Controller.CreateFlow`/`s.fc.CreateFlow`, extract candidate targets from `input` and verify each. This gives the user a precise GraphQL/REST error.
2. **Controller layer (defense-in-depth, single choke point):** add the check at the top of `flowController.CreateFlow` (`flows.go:276`) before `reserveFlow`. This guarantees no path — including any future caller — can bypass it.

Implement **both**: a helpful error at the edge, and a hard fail-closed guard in the controller so the invariant cannot be lost. Sketch for the controller guard:

```go
// at top of flowController.CreateFlow, before reserveFlow
targets, err := targetsFromInput(input)   // same extractor the resolver uses
if err != nil || len(targets) == 0 {
    return 0, fmt.Errorf("no verifiable target found in flow input; verify a target first")
}
for _, t := range targets {
    n, err := fc.db.CountActiveVerifiedTargetForUser(ctx,
        database.CountActiveVerifiedTargetForUserParams{UserID: userID, Target: t})
    if err != nil { return 0, fmt.Errorf("target verification check failed: %w", err) }
    if n == 0 {
        return 0, fmt.Errorf("target %q is not verified for this account", t)
    }
}
```

`flowController` already holds a `db` handle (used throughout `flows.go`/`flow.go`, e.g. `flow.go:146` `fwc.db.CreateFlow`), so `CountActiveVerifiedTargetForUser` is reachable without new plumbing.

**Target extraction (`targetsFromInput`) is the hard, honest part.** The flow `input` is free-form natural language ("scan it" is a real test input — `flows_test.go:343`). Reliably pulling the intended target(s) out of prose is non-trivial and is itself a security boundary: a weak extractor that misses a hostname lets an unverified attack through. Options, cheapest to safest:

- **v1 (ship first):** require the user to select a verified target from a dropdown (a new required GraphQL arg `targetId: ID!` on `createFlow`, resolved to the verified row), and inject the hostname into the prompt. This makes the target explicit and the gate trivial — no NL extraction needed. This is the recommended starting design even though it changes the `createFlow` signature.
- **v2:** NL extraction with a strict allowlist: parse hostnames/IPs/CIDRs from `input`, and refuse the flow if any extracted target is unverified **or** if extraction is uncertain. Fail-closed on ambiguity.

Recommend v1 for launch: it removes the extraction risk entirely and is a small schema change.

## 6. Frontend

New feature directory `frontend/src/features/targets/` (siblings: `authentication`, `flows`, `knowledges`, `resources`, `templates` — verified in `frontend/src/features/`), plus a settings page `frontend/src/pages/settings/settings-targets.tsx` modeled on `settings-api-tokens.tsx`. Per `CLAUDE.md`, GraphQL reads/subscriptions go in `frontend/src/providers/*`, and operations are declared in `frontend/graphql-schema.graphql` then regenerated. The target-select on the create-flow form lives in `frontend/src/features/flows/` since data coupling belongs in the feature that renders it.

UI flow: user adds a target → UI shows the TXT record to publish (`_nullhawk-verify.<domain>  TXT  "nullhawk-verify=<token>"`) → user clicks "Check" → `checkTargetVerification` → status flips to `verified`. Only `verified` targets appear in the create-flow dropdown.

## 7. DNS-TXT verification logic (Go sketch)

Lives in a new `backend/pkg/targetverify/` package (keep it out of `pkg/tools` and `pkg/controller` to avoid import cycles; the resolver and the controller guard both import it). Uses only the stdlib `net` resolver.

```go
func VerifyDNSTXT(ctx context.Context, res *net.Resolver, domain, token string) error {
    name := "_nullhawk-verify." + domain
    records, err := res.LookupTXT(ctx, name)
    if err != nil {
        return fmt.Errorf("could not read TXT at %s: %w", name, err)   // fail-closed
    }
    for _, r := range records {
        if subtle.ConstantTimeCompare([]byte(strings.TrimSpace(r)), []byte(token)) == 1 {
            return nil
        }
    }
    return fmt.Errorf("no matching TXT record at %s", name)
}
```

Notes that make this correct rather than merely plausible: use a context deadline (DNS can hang); the DNS resolver must egress through the controlled path, and the lookup itself is outbound to public DNS, not to the target — so it is safe to run even before the target is trusted; re-verify on a schedule by checking `expires_at` so a target that moves hands later loses access. `http_file` and `email` methods slot in as additional `case`s dispatched by `method`.

## 8. Codegen commands (per `CLAUDE.md`, must all run — needs the toolchain)

1. `sqlc generate` from `backend/sqlc/` — **needs a live PostgreSQL in `DATABASE_URL`** (writes `backend/pkg/database/`).
2. `go run github.com/99designs/gqlgen --config ./gqlgen/gqlgen.yml` from `backend/` (writes `pkg/graph/generated.go`, `pkg/graph/model/`, resolver stubs).
3. `swag init -g ../../pkg/server/router.go -o pkg/server/docs/ --parseDependency --parseInternal --parseDepth 2 -d cmd/pentagi` from `backend/`.
4. `pnpm run graphql:generate` from `frontend/` after declaring the new operations in `frontend/graphql-schema.graphql` (writes `frontend/src/graphql/types.ts`; CI fails if the committed file differs).
5. Rebuild the binary (migrations are embedded — a restart alone will not pick up the new migration).

**Flag:** none of steps 1-4 can be run or verified in this environment — they require the Go toolchain, pnpm, and (for sqlc) a live Postgres. The migration SQL and schema additions above are hand-written to match the repo's conventions but must be regenerated and compiled before trusting them.
