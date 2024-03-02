import { z } from 'zod';

import { procedure, router } from '$lib/server/trpc';

import { createItinerary } from '../openai';
import { Poi } from '../schema';

export const app = router({
	create: procedure
		.meta({openapi: {
			method: 'POST',
			path: '/itinerary/create',
			summary: 'Create an itinerary',
			description: 'Create an itinerary based on the latitude and longitude provided.',
			tags: ['itinerary'],
		}})
		.input(z.object({ lat: z.number().max(90).min(-90),
			long: z.number().max(180).min(-180) }))
		.output(Poi.array())
		.query(async ({input}) => {
			return await createItinerary(input.lat, input.long);
		}),
})

export default app;
export type Router = typeof app;
