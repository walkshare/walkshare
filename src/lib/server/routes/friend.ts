import { and, eq, or } from 'drizzle-orm';
import { z } from 'zod';

import { protectedProcedure, router } from '$lib/server/trpc';

import { db } from '../db';
import { friend } from '../db/schema';

export const app = router({
	add: protectedProcedure
		.meta({openapi: {
			method: 'POST',
			path: '/friend/add',
			summary: 'Add a friend',
			description: 'Add a friend with the corresponding id.',
			tags: ['friend'],
		}})
		.input(z.string().uuid())
		.output(z.void())
		.query(async ({ input, ctx }) => {
			await db.insert(friend).values({
				userId: ctx.session.user.userId,
				friendId: input,
			}).onConflictDoNothing()
		}),
	remove: protectedProcedure
		.meta({openapi: {
			method: 'POST',
			path: '/friend/remove',
			summary: 'Remove a friend',
			description: 'Remove a friend with the corresponding id.',
			tags: ['friend'],
		}})
		.input(z.string().uuid())
		.output(z.void())
		.query(async ({ input, ctx }) => {
			await db.delete(friend).where(or(
				and(eq(friend.userId, input), eq(friend.friendId, ctx.session.user.userId)), 
				and(eq(friend.friendId, input), eq(friend.userId, ctx.session.user.userId))))
		}),
	confirm: protectedProcedure
		.meta({openapi: {
			method: 'POST',
			path: '/friend/confirm',
			summary: 'Confirm a friend request',
			description: 'Confirm a friend request with the corresponding id.',
			tags: ['friend'],
		}})
		.input(z.string().uuid())
		.output(z.void())
		.query(async ({ input, ctx }) => {
			await db
				.update(friend)
				.set({ pending: false })
				.where(or(
					and(eq(friend.userId, input), eq(friend.friendId, ctx.session.user.userId)), 
					and(eq(friend.friendId, input), eq(friend.userId, ctx.session.user.userId))))
		}),
})

export default app;
export type Router = typeof app;
