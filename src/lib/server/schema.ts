import { createSelectSchema } from 'drizzle-zod';

import { user } from './db/schema';

export const User = createSelectSchema(user);
