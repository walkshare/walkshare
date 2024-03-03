import { and, gte, lte, or, type SQL } from 'drizzle-orm';
import OpenAi from 'openai';

import { OPENAI_API_KEY } from '$env/static/private';

import { db } from './db';
import { poi } from './db/schema';

const openai = new OpenAi({
	apiKey: OPENAI_API_KEY,
})

export async function createItinerary(lat: number, long: number) {

	const distance = 1;

	const filters: SQL[] = [];

	filters.push(or(gte(poi.latitude, lat - distance), lte(poi.latitude, long + distance))!);
	filters.push(or(gte(poi.longitude, lat - distance), lte(poi.longitude, long + distance))!);

	const input = `You are tasked with creating an itinerary of points of interest to visit, given latitude and longitude. 
    You must pick 4-8 points of interest for a user to visit based off their position. Return ONLY the id of each location that you have chosen, seperated by new lines.`;

	const data = await db.query.poi.findMany({
		where: and(...filters),
		limit: 10,
	});

	const response = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: input,
			},
			{
				role: 'user',
				content: data.map((poi) => `name: ${poi.name} - id: ${poi.id}`).join('\n'),
			},
		],
		model: 'gpt-3.5-turbo',
	})

	return response.choices[0].message.content!.split('\n').map((it) => {
		return data.find((e) => e.id == it)!
	}).filter((e) => e);
}