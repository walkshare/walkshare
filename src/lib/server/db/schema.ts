import {
	bigint,
	pgTable,
	real,
	text,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { vector } from 'pgvector/drizzle-orm';

export const poi = pgTable('poi', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	// stored as base64 webp
	thumbnail: text('thumbnail').notNull(),
	latitude: real('latitude').notNull(),
	longitude: real('longitude').notNull(),
	tags: text('tags').array().notNull(),
	address: text('address').notNull(),
	embedding: vector('embedding', { dimensions: 768 }).notNull(),
});

export const event = pgTable('event', {
	id: uuid('id').primaryKey().defaultRandom(),
	authorId: varchar('author_id', { length: 15 })
		.references(() => user.id)
		.notNull(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	tags: text('tags').array().notNull(),
	itinerary: uuid('itinerary').array().notNull(),
	startsAt: timestamp('start_time', { withTimezone: true }).notNull(),
	endsAt: timestamp('end_time', { withTimezone: true }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	embedding: vector('embedding', { dimensions: 768 }).notNull(),
});

export const attendance = pgTable('attendance', {
	eventId: uuid('event_id')
		.references(() => event.id)
		.notNull(),
	userId: varchar('user_id', { length: 15 })
		.references(() => user.id)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const friend = pgTable('friend', {
	userId: varchar('user_id', { length: 15 })
		.references(() => user.id)
		.notNull(),
	friendId: varchar('friend_id', { length: 15 })
		.references(() => user.id)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

// Table definitions for Lucia Auth
export const user = pgTable('user', {
	id: varchar('id', { length: 15 }).primaryKey(),
	name: text('name').notNull(),
	username: varchar('username', { length: 39 }).unique().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const userKey = pgTable('user_key', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 15 })
		.references(() => user.id)
		.notNull(),
	password: varchar('hashed_password', { length: 255 }),
});

export const userSession = pgTable('user_session', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: varchar('user_id', { length: 15 })
		.references(() => user.id)
		.notNull(),
	activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'number' }).notNull(),
});
