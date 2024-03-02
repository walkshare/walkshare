import { and, gte, lte, or, SQL } from 'drizzle-orm';
import OpenAi from 'openai';

import { OPENAI_API_KEY } from '$env/static/private';

import { db } from './db';
import { poi } from './db/schema';
import type { Poi } from './schema';
const openai = new OpenAi({
	apiKey: OPENAI_API_KEY,
})

export async function createItinerary(lat: number, long: number)  {

	const distance = 0.2;

	const filters: SQL[] = [];

	filters.push(or(gte(poi.latitude, lat - distance), lte(poi.latitude, long + distance))!);
	filters.push(or(gte(poi.longitude, lat - distance), lte(poi.longitude, long - distance))!);

	const input = `You are tasked with creating an itinerary of points of interest to visit, given latitude and longitude. 
    You must pick 2-5 points of interest for a user to visit based off their position. Return only the ids of each poi that you have chosen, seperated by a new line.`;

	const data = await db.query.poi.findMany({
		where: and(...filters),
	})
    
	query(input, data)

}

async function query(input: string, data: Poi[]) {
	const response = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: input,
			},
			{
				role: 'user',
				content: data.map((poi) => `${poi.id}, longitude: ${poi.longitude}, latitude: ${poi.latitude}`).join('\n'),
			},
		],
		model: 'gpt-3.5-turbo',
	})

	return response.choices[0].message.content;
}