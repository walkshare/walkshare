import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { event, user } from './db/schema';

export const User = createSelectSchema(user);

export const Event = createSelectSchema(event, { tags: z.string().array() });
export type Event = z.infer<typeof Event>;
