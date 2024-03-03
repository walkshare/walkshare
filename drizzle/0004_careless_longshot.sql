CREATE TABLE IF NOT EXISTS "itinerary" (
	"event_id" uuid NOT NULL,
	"index" integer NOT NULL,
	"poi_id" uuid NOT NULL,
	CONSTRAINT "itinerary_event_id_index_pk" PRIMARY KEY("event_id","index")
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_event_id_user_id_pk" PRIMARY KEY("event_id","user_id");--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_friend_id_user_id_pk" PRIMARY KEY("friend_id","user_id");--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "thumbnail" text NOT NULL;--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN IF EXISTS "itinerary";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_poi_id_poi_id_fk" FOREIGN KEY ("poi_id") REFERENCES "poi"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
