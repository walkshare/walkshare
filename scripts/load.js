import "dotenv/config";

import axios from 'axios';
import * as fs from "fs";
import pg from "pg";

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});

const ai = axios.create({
	baseURL: 'http://localhost:5000',
});

function createPoiEmbedding(poi) {
	const text = `${poi.name} ${poi.address} ${poi.description} ${poi.tags.join(' ')}`;
	return embedText(text);
}

async function embedText(text) {
	const response = await ai.post('/', { text });
	return response.data.embedding;
}

async function main() {
	let rawdata = fs.readFileSync("./data/places.json", "utf8");
	let rawdata2 = fs.readFileSync("./data/places2.json", "utf8");
	let places = JSON.parse(rawdata);
	let places2 = JSON.parse(rawdata);

	for (let place of places) {
		const d = places2.find(p => p.id === place.id);
		if (!d) continue;

		const poi = {
			name: place.name,
			adress: place.address,
			description: "test",
			tags: place.types,
		};

		const embedding = await createPoiEmbedding(poi);

		await pool.query(`
		INSERT INTO poi (name, latitude, longitude, tags,
			description, thumbnail, address, embedding) VALUES ($1, $2, $3, $4,
				$5, $6, $7, $8)`,
			[place.name, place.point.coordinates[1],
			place.point.coordinates[0], place.types, d.description, "test",
			place.address, `[${embedding.join(',')}]`]);
	}
}

main();
