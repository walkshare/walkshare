import { router, procedure } from '$lib/server/trpc';
import { protectedProcedure } from '$lib/server/trpc';
import { z } from 'zod';
import { Event } from '../schema';
import { db } from '../db';
import { event } from '../db/schema';
import showdown from 'showdown';
import { sanitizeHtml } from '../util';

const convertor = new showdown.Converter();

export const app = router({
	create: protectedProcedure
		.input(Event.omit({ id: true, authorId: true, createdAt: true }))
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			const html = convertor.makeHtml(input.description);
			const clean = sanitizeHtml(html);

			await db.insert(event).values({
				...input,
				authorId: ctx.session.user.userId,
				description: clean,
			});
		}),
});

export default app;
export type Router = typeof app;
