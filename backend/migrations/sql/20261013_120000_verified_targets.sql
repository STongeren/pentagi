-- +goose Up
-- +goose StatementBegin
CREATE TYPE TARGET_VERIFICATION_METHOD AS ENUM ('dns_txt', 'http_file', 'email');
CREATE TYPE TARGET_VERIFICATION_STATUS AS ENUM ('pending', 'verified', 'failed', 'revoked', 'expired');

CREATE TABLE verified_targets (
  id            BIGINT                      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id       BIGINT                      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target        TEXT                        NOT NULL,
  method        TARGET_VERIFICATION_METHOD  NOT NULL DEFAULT 'dns_txt',
  token         TEXT                        NOT NULL,
  status        TARGET_VERIFICATION_STATUS  NOT NULL DEFAULT 'pending',
  last_error    TEXT                        NULL,
  verified_at   TIMESTAMPTZ                 NULL,
  expires_at    TIMESTAMPTZ                 NULL,
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
