import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { event, itinerary, poi, user } from './db/schema';

export const User = createSelectSchema(user);

export const Event = createInsertSchema(event, { tags: z.string().array() })
	.omit({
		embedding: true,
	});

export type Event = z.infer<typeof Event>;
export type EventWithItinerary = Event & { itinerary: ItineraryWithPoi };

export const Itinerary = createSelectSchema(itinerary);
export type Itinerary = z.infer<typeof Itinerary>;
export type ItineraryWithPoi = Itinerary & { poi: Poi };

export const Poi = createSelectSchema(poi, { tags: z.string().array() })
	.omit({
		embedding: true,
	});

export type Poi = z.infer<typeof Poi>;
