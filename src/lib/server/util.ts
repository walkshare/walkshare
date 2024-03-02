import sanitize from 'sanitize-html';

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
