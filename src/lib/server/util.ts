import axios from 'axios';
import { type SQL, sql, type SQLWrapper } from 'drizzle-orm';
import sanitize from 'sanitize-html';
import showdown from 'showdown';

import { TEXT_EMBEDDER_PORT } from '$env/static/private';

import { Event, Poi } from './schema';

const converter = new showdown.Converter();
const ai = axios.create({
	baseURL: 'http://127.0.0.1:' + TEXT_EMBEDDER_PORT,
});

function sanitizeHtml(html: string) {
	return sanitize(html, {
		allowedTags: [
			'b',
			'i',
			'em',
			'strong',
			'a',
			'p',
			'ul',
			'ol',
			'li',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
		],
		allowedAttributes: {
			a: ['href'],
		},
	});
}

export function convertMarkdown(
	markdown: string,
) {
	return sanitizeHtml(converter.makeHtml(markdown));
}

export function createEventEmbedding(event: Event): Promise<number[]> {
	const text = `${event.name} ${event.description} ${event.tags.join(' ')}`;
	return embedText(text);
}

export function createPoiEmbedding(poi: Poi): Promise<number[]> {
	const text = `${poi.name} ${poi.address} ${poi.description} ${poi.tags.join(' ')}`;
	return embedText(text);
}

export async function embedText(text: string): Promise<number[]> {
	const response = await ai.post('/', { text });
	return response.data.embedding;
}

export function maxInnerProduct(lhs: SQLWrapper, rhs: SQLWrapper | number[]): SQL<number> {
	return Array.isArray(rhs) ? sql`${lhs} <#> ${`[${rhs.join(',')}]`}` : sql`${lhs} <#> ${rhs}`;
}