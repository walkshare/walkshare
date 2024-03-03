import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { poi } from '$lib/server/db/schema';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const [e] = await db.select({
		thumbnail: poi.thumbnail,
	})
		.from(poi)
		.where(eq(poi.id, params.id));

	if (!e) {
		return error(404);
	}

	return new Response(Buffer.from(e.thumbnail, 'base64'), {
		headers: {
			'Content-Type': 'image/webp',
		},
	});
};
