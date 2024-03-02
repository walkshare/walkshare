import { router } from '$lib/server/trpc';

import event from './event';
import friend from './friend'
import itinerary from './itinerary'
import poi from './poi';

export const app = router({
	event,
	poi,
	friend,
	itinerary,
});

export default app;
export type Router = typeof app;
