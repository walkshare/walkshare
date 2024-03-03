import { TRPCError } from '@trpc/server';
import { and, arrayOverlaps, asc, count, eq, exists, SQL, sql } from 'drizzle-orm';
import sharp from 'sharp';
import { z } from 'zod';

import { procedure, router } from '$lib/server/trpc';
import { protectedProcedure } from '$lib/server/trpc';

import { db } from '../db';
import { attendance, event, itinerary } from '../db/schema';
import { Event, EventWithItinerary } from '../schema';
import { convertMarkdown, createEventEmbedding, embedText, maxInnerProduct } from '../util';

export const app = router({
	create: protectedProcedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/event/create',
				summary: 'Create event',
				description: 'Creates an event',
				tags: ['event'],
			},
		})
		.input(
			Event.omit({
				id: true,
				authorId: true,
				createdAt: true,
				embedding: true,
			}).extend({
				itinerary: z.string().uuid().array(),
			}),
		)
		.output(z.string().uuid())
		.mutation(async ({ input, ctx }) => {
			input.description = convertMarkdown(input.description);

			const list = input.itinerary;

			// @ts-expect-error - we remove this
			input.itinerary = undefined;

			input.thumbnail = input.thumbnail && (await sharp(
				Buffer.from(input.thumbnail.slice(input.thumbnail.indexOf(',') + 1), 'base64'),
			)
				.resize(1920, 1080, {
					fit: 'cover',
					position: 'center',
				})
				.webp()
				.toBuffer()
			)
				.toString('base64');

			const embedding = await createEventEmbedding(input);

			const [{ id }] = await db.insert(event).values({
				...input,
				embedding,
				authorId: ctx.session.user.userId,
			}).returning({
				id: event.id,
			});

			await db.insert(itinerary).values(list.map((l, i) => ({
				eventId: id,
				poiId: l,
				index: i,
			})));

			return id;
		}),
	update: protectedProcedure
		.meta({
			openapi: {
				method: 'PATCH',
				path: '/event/update',
				summary: 'Update event',
				description: 'Updates an event',
				tags: ['event'],
			},
		})
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


			const [e] = await db
				.update(event)
				.set(input)
				.where(
					and(
						eq(event.id, input.id),
						eq(event.authorId, ctx.session.user.userId),
					),
				).returning({
					name: event.name,
					description: event.description,
					tags: event.tags,
				});

			const embedding = await createEventEmbedding(e);

			await db
				.update(event)
				.set({ embedding })
				.where(eq(event.id, input.id));
		}),
	delete: protectedProcedure
		.meta({
			openapi: {
				method: 'DELETE',
				path: '/event/{id}',
				summary: 'Delete event',
				description: 'Deletes an event',
				tags: ['event'],
			},
		})
		.input(z.object({
			id: z.string().uuid(),
		}))
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			await db
				.delete(event)
				.where(
					and(eq(event.id, input.id), eq(event.authorId, ctx.session.user.userId)),
				);
		}),
	join: protectedProcedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/event/{id}/join',
				summary: 'Join event',
				description: 'Join an event with the current logged in account.',
				tags: ['event'],
			},
		})
		.input(z.object({
			id: z.string().uuid(),
		}))
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			await db.insert(attendance).values({
				eventId: input.id,
				userId: ctx.session.user.userId,
			});
		}),
	leave: protectedProcedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/event/{id}/leave',
				summary: 'Leave event',
				description: 'Leave an event with the current logged in account.',
				tags: ['event'],
			},
		})
		.input(z.object({
			id: z.string().uuid(),
		}))
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			await db
				.delete(attendance)
				.where(
					and(
						eq(attendance.eventId, input.id),
						eq(attendance.userId, ctx.session.user.userId),
					),
				);
		}),
	getOne: procedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/event/{id}',
				summary: 'Get an event',
				description: 'Get an event with the corresponding id.',
				tags: ['event'],
			},
		})
		.input(z.object({
			id: z.string().uuid(),
		}))
		.output(EventWithItinerary.extend({
			joined: z.boolean(),
			count: z.number(),
		}))
		// @ts-expect-error - expected
		.query(async ({ input, ctx }) => {
			const at = db.select({ value: count() }).from(attendance).where(eq(attendance.eventId, input.id));

			const data = await db.query.event.findFirst({
				where: eq(event.id, input.id),
				with: {
					itinerary: {
						with: {
							poi: true,
						},
						orderBy: [asc(itinerary.index)],
					},
					author: true,

				},
				extras: {
					joined: ctx.session ? (exists(db.select({
						value: sql`1`,
					})
						.from(attendance)
						.where(and(
							eq(attendance.userId, ctx.session.user.userId),
							eq(attendance.eventId, input.id),
						))) as SQL<boolean>).as('j')
						: sql<boolean>`false`.as('j'),
					count: sql<number>`${at}::integer`.as('c'),
				},
			});

			if (!data) {
				throw new TRPCError({
					message: 'event_not_found',
					code: 'NOT_FOUND',
				})
			}

			return data;
		}),
	getAll: procedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/event',
				summary: 'Get all events',
				description: 'Get all events',
				tags: ['event'],
			},
		})
		.input(z.object({
			page: z.number().int().min(1),
			limit: z.number().int().min(10).max(50),
			query: z.string().max(128),
			tags: z.string().array(),
		})).output(EventWithItinerary.array())
		// @ts-expect-error - expected
		.mutation(async ({ input }) => {
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
				with: {
					itinerary: {
						with: {
							poi: true,
						},
						orderBy: [asc(itinerary.index)],
					},
					author: true,
				},
			});

			return data;
		}),
	recommended: procedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/event/recommended',
				summary: 'Get recommended events.',
				description: 'Get events similar to the provided event.',
				tags: ['event'],
			},
		})
		.input(z.object({ id: z.string().uuid() }))
		.output(Event.array())
		.query(async () => {
			const data = await db.query.event.findMany({
				limit: 10,
			})

			return data;
		}),

});

export default app;
export type Router = typeof app;
