import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const _env = process.env;

export const env = createEnv({
  clientPrefix: 'FIX_SERVER_ERROR',
  client: {},
  server: {
    // Database
    DATABASE_URL: z.string().url(),
    REVERT_API_URL: z.string().url().default('https://api.revert.finance/v1'),

    REVERT_API_REQUEST_PER_SECOND: z.number().default(50),
  },
  runtimeEnv: {
    ..._env,
  },
  emptyStringAsUndefined: true,
});
