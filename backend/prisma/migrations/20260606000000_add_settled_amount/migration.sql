-- Add partial settlement tracking on expense participants
ALTER TABLE "expense_participants" ADD COLUMN "settled_amount" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- Backfill: rows already marked settled should reflect full share
UPDATE "expense_participants"
SET "settled_amount" = "share_amount"
WHERE "is_settled" = true;
