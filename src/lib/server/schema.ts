import { createInsertSchema,createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { event, poi, user } from './db/schema';

export const User = createSelectSchema(user);
export const Event = createInsertSchema(event, { tags: z.string().array() });
export type Event = z.infer<typeof Event>;
export const Poi = createSelectSchema(poi, { tags: z.string().array() })
export type Poi = z.infer<typeof Poi>;