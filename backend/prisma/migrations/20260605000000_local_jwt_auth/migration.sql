CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" TEXT;

UPDATE "users"
SET "password_hash" = crypt(gen_random_uuid()::text, gen_salt('bf'))
WHERE "password_hash" IS NULL OR "password_hash" = '';

ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;

ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_auth_id_key";
ALTER TABLE "users" DROP COLUMN IF EXISTS "auth_id";
