import { router } from '$lib/server/trpc';

export const app = router({});

export default app;
export type Router = typeof app;
