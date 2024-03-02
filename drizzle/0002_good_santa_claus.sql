CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "embedding" vector(768) NOT NULL;--> statement-breakpoint
ALTER TABLE "poi" ADD COLUMN "embedding" vector(768) NOT NULL;