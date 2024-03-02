import { router } from '$lib/server/trpc';
import event from './event';
export const app = router({ event });

export default app;
export type Router = typeof app;
