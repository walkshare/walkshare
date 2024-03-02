import { createTRPCProxyClient, httpLink } from '@trpc/client';

import { PUBLIC_BASE_URL, PUBLIC_SOLACE_HOST_URL, PUBLIC_SOLACE_PASSWORD, PUBLIC_SOLACE_USER, PUBLIC_SOLACE_VPN } from '$env/static/public';
import type { Router } from '$lib/server/routes';

import { Subscriber } from './pubsub';

export const trpc = createTRPCProxyClient<Router>({
	links: [
		httpLink({
			url: new URL('/api', PUBLIC_BASE_URL),
		}),
	],
});

export const subscriber = new Subscriber({
	url: PUBLIC_SOLACE_HOST_URL,
	vpnName: PUBLIC_SOLACE_VPN,
	userName: PUBLIC_SOLACE_USER,
	password: PUBLIC_SOLACE_PASSWORD,
});
