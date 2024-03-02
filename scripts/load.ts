import "dotenv/config";
import { poi } from "../src/lib/server/db/schema.js";
import * as fs from "fs";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../src/lib/server/db/schema.js";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

async function main() {
  let rawdata = fs.readFileSync("./data/places.json", "utf8");
  let places = JSON.parse(rawdata);

  for (let place of places) {
    await db
      .insert(poi)
      .values({
        name: place.name,
        latitude: place.point.coordinates[1],
        longitude: place.point.coordinates[0],
        tags: place.types,
        description: "test",
        thumbnail: "test",
        address: place.address,
      });
  }
}

main();
