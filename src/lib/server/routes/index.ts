import { router } from '$lib/server/trpc';

import event from './event';
import friend from './friend'
import poi from './poi';

export const app = router({
	event,
	poi,
	friend,
});

export default app;
export type Router = typeof app;
