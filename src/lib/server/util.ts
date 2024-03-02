import axios from 'axios';
import sanitize from 'sanitize-html';

import { TEXT_EMBEDDER_PORT } from '$env/static/private';

import { Event } from './schema';

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
	converter: showdown.Converter,
) {
	const html = converter.makeHtml(markdown);
	return sanitizeHtml(converter.makeHtml(html));
}

export function createEventEmbedding(event: Event): Promise<number[]> {
	const text = `${event.name} ${event.description} ${event.tags.join(' ')}`;
	return embedText(text);
}

async function embedText(text: string): Promise<number[]> {
	const response = await ai.post('/', { text });
	return response.data.embedding;
}
