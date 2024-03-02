import sanitize from 'sanitize-html';
import { Event } from './schema';
import axios from 'axios';
import { TEXT_EMBEDDER_PORT } from '$env/static/private';

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
	converter: showdown.Converter
) {
	const html = converter.makeHtml(markdown);
	return sanitizeHtml(converter.makeHtml(html));
}

export async function createEventEmbedding(event: Event) {

}

async function embedText(text: string) {
	
}