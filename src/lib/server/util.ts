import sanitize from 'sanitize-html';

export function sanitizeHtml(html: string) {
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
