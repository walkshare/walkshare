import { TRPCError } from '@trpc/server';
import { and, arrayOverlaps, eq, SQL } from 'drizzle-orm';
import { z } from 'zod';

import { procedure, router } from '$lib/server/trpc';
import { protectedProcedure } from '$lib/server/trpc';

import { db } from '../db';
import { attendance, event } from '../db/schema';
import { Event } from '../schema';
import { convertMarkdown, embedText, maxInnerProduct } from '../util';

export const app = router({
	create: protectedProcedure
		.input(
			Event.omit({
				id: true,
				authorId: true,
				createdAt: true,
				embedding: true,
			}),
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
				.omit({
					authorId: true,
					createdAt: true,
				}),
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
	getOne: procedure.input(z.string().uuid()).output(Event).query(async ({ input }) => {
		const data = await db.query.event.findFirst({ where: eq(event.id, input) });

		if (!data) {
			throw new TRPCError({
				message: 'event_not_found',
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
	})).output(Event.array()).query(async ({ input }) => {
		const filters: SQL[] = [];
		const orders: SQL<number>[] = [];

		if (input.tags.length) {
			filters.push(arrayOverlaps(event.tags, input.tags));
		}

		if (input.query) {
			const embedded = await embedText(input.query);
			orders.push(maxInnerProduct(event.embedding, embedded));
		}

		const data = await db.query.event.findMany({
			offset: (input.page - 1) * input.limit,
			limit: input.limit,
			where: and(...filters),
			orderBy: orders,
		});

		return data;
	}),
});

export default app;
export type Router = typeof app;
