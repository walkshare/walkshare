import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { event, itinerary, poi, user } from './db/schema';

export const User = createSelectSchema(user);

export const Poi = createSelectSchema(poi, { tags: z.string().array() })
	.omit({
		embedding: true,
	});

export type Poi = z.infer<typeof Poi>;

export const Itinerary = createSelectSchema(itinerary);
export const ItineraryWithPoi = Itinerary.extend({
	poi: Poi,
});

export type Itinerary = z.infer<typeof Itinerary>;
export type ItineraryWithPoi = z.infer<typeof ItineraryWithPoi>;

export const Event = createInsertSchema(event, {
	tags: z.string().array(),
	startsAt: z.coerce.date(),
	endsAt: z.coerce.date(),
})
	.omit({
		embedding: true,
	});

export const EventWithItinerary = Event.extend({
	itinerary: ItineraryWithPoi.array(),
});

export type Event = z.infer<typeof Event>;
export type EventWithItinerary = z.infer<typeof EventWithItinerary>;
