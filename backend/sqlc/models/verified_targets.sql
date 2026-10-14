-- name: CreateVerifiedTarget :one
INSERT INTO verified_targets (user_id, target, method, token, status)
VALUES ($1, $2, $3, $4, 'pending') RETURNING *;

-- name: GetUserVerifiedTarget :one
SELECT * FROM verified_targets
WHERE user_id = $1 AND target = $2 AND deleted_at IS NULL;

-- name: GetVerifiedTargetByID :one
SELECT * FROM verified_targets
WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL;

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

-- name: SoftDeleteVerifiedTarget :exec
UPDATE verified_targets
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL;

-- name: CountActiveVerifiedTargetForUser :one
SELECT COUNT(*) FROM verified_targets
WHERE user_id = $1 AND target = $2 AND status = 'verified' AND deleted_at IS NULL
  AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP);
