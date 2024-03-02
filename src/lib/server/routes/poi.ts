import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { procedure, router } from '$lib/server/trpc';

import { db } from '../db';
import { poi } from '../db/schema';
import { Poi } from '../schema';


export const app = router({
	getOne: procedure.input(z.string().uuid()).output(Poi).query(async ({input}) => {
		const data = await db.query.poi.findFirst({ where: eq(poi.id, input)});

		if (!data) {
			throw new TRPCError({ message: 'Could not find this id.', code: 'NOT_FOUND'})
		}
		return data;
	}),
	getAll: procedure.output(Poi.array()).query(async () => {
		const data = await db.query.poi.findMany();
		return data;
	}),
})