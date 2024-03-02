import { router } from '$lib/server/trpc';

import event from './event';
import poi from './poi';

export const app = router({ event, poi });

export default app;
export type Router = typeof app;
