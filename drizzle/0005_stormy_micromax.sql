ALTER TABLE "event" RENAME COLUMN "start_time" TO "starts_at";--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN IF EXISTS "end_time";