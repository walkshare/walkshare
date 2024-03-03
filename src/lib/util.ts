export function capitalize(str: string) {
	return str[0].toUpperCase() + str.slice(1).replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
}

export function distance(pt1: [number, number], pt2: [number, number]) {
	return (
		Math.acos(
			Math.sin(pt1[0]) * Math.sin(pt2[0]) +
				Math.cos(pt1[0]) * Math.cos(pt2[0]) * Math.cos(pt2[1] - pt1[1]),
		) * 6371
	);
}