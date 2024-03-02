import { TRPCError } from '@trpc/server';
import { and, arrayOverlaps, eq, SQL } from 'drizzle-orm';
import { z } from 'zod';

import { procedure, router } from '$lib/server/trpc';

import { db } from '../db';
import { poi } from '../db/schema';
import { Poi } from '../schema';
import { embedText, maxInnerProduct } from '../util';


export const app = router({
	getOne: procedure.input(z.string().uuid()).output(Poi).query(async ({ input }) => {
		const data = await db.query.poi.findFirst({ where: eq(poi.id, input) });

		if (!data) {
			throw new TRPCError({
				message: 'poi_not_found',
				code: 'NOT_FOUND',
			})
		}
		return data;
	}),
	getAll: procedure.input(z.object({
		page: z.number().int().min(1),
		limit: z.number().int().min(10).max(50),
		query: z.string().max(128),
		tags: z.string().array(),
	})).output(Poi.array()).query(async ({ input }) => {
		const filters: SQL[] = [];
		const orders: SQL<number>[] = [];

		if (input.tags.length) {
			filters.push(arrayOverlaps(poi.tags, input.tags));
		}

		if (input.query) {
			const embedded = await embedText(input.query);
			orders.push(maxInnerProduct(poi.embedding, embedded));
		}

		const data = await db.query.poi.findMany({
			offset: (input.page - 1) * input.limit,
			limit: input.limit,
			where: and(...filters),
			orderBy: orders,
		});

		return data;
	}),
})

export default app;
export type Router = typeof app;
