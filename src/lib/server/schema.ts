import { createSelectSchema } from 'drizzle-zod';

import { event, user } from './db/schema';
import { z } from 'zod';

export const User = createSelectSchema(user);
export const Event = createSelectSchema(event, { tags: z.string().array() });
export type Event = z.infer<typeof Event>;
