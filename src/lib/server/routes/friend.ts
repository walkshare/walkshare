import { and, eq, or } from 'drizzle-orm';
import { z } from 'zod';

import { protectedProcedure, router } from '$lib/server/trpc';

import { db } from '../db';
import { friend } from '../db/schema';

export const app = router({
	add: protectedProcedure.input(z.string().uuid()).output(z.void()).query(async ({ input, ctx }) => {
		await db.insert(friend).values({
			userId: ctx.session.user.userId,
			friendId: input,
		}).onConflictDoNothing()
	}),
	remove: protectedProcedure.input(z.string().uuid()).output(z.void()).query(async ({ input, ctx }) => {
		await db.delete(friend).where(or(and(eq(friend.userId, input), eq(friend.friendId, ctx.session.user.userId)), and(eq(friend.friendId, input), eq(friend.userId, ctx.session.user.userId))))
	}),
	confirm: protectedProcedure.input(z.string().uuid()).output(z.void()).query(async ({ input, ctx }) => {
		await db.update(friend).set({ pending: false }).where(or(and(eq(friend.userId, input), eq(friend.friendId, ctx.session.user.userId)), and(eq(friend.friendId, input), eq(friend.userId, ctx.session.user.userId))))
	}),
})

export default app;
export type Router = typeof app;
