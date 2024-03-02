import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { router } from '$lib/server/trpc';
import { protectedProcedure } from '$lib/server/trpc';

import { db } from '../db';
import { attendance, event } from '../db/schema';
import { Event } from '../schema';
import { convertMarkdown } from '../util';

export const app = router({
	create: protectedProcedure
		.input(
			Event.omit({ id: true, authorId: true, createdAt: true, embedding: true }),
		)
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			input.description = convertMarkdown(input.description);

			await db.insert(event).values({
				...input,
				authorId: ctx.session.user.userId,
			});
		}),
	update: protectedProcedure
		.input(
			Event.partial()
				.required({ id: true })
				.omit({ authorId: true, createdAt: true }),
		)
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			if (input.description) {
				input.description = convertMarkdown(input.description);
			}

			await db
				.update(event)
				.set(input)
				.where(
					and(
						eq(event.id, input.id),
						eq(event.authorId, ctx.session.user.userId),
					),
				);
		}),
	delete: protectedProcedure
		.input(z.string().uuid())
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			await db
				.delete(event)
				.where(
					and(eq(event.id, input), eq(event.authorId, ctx.session.user.userId)),
				);
		}),
	join: protectedProcedure
		.input(z.string().uuid())
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			await db.insert(attendance).values({
				eventId: input,
				userId: ctx.session.user.userId,
			});
		}),
	leave: protectedProcedure
		.input(z.string().uuid())
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			await db
				.delete(attendance)
				.where(
					and(
						eq(attendance.eventId, input),
						eq(attendance.userId, ctx.session.user.userId),
					),
				);
		}),
});

export default app;
export type Router = typeof app;
