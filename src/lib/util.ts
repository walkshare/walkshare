export function capitalize(str: string) {
	return str[0].toUpperCase() + str.slice(1).replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
}
