import { createTRPCProxyClient, httpLink } from '@trpc/client';

import { PUBLIC_BASE_URL } from '$env/static/public';
import type { Router } from '$lib/server/routes';

export const trpc = createTRPCProxyClient<Router>({
	links: [
		httpLink({
			url: new URL('/api', PUBLIC_BASE_URL),
		}),
	],
});
