import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

const currentDir = dirname(fileURLToPath(import.meta.url));
const localEnvPath = resolve(currentDir, '../../apps/api/.env');
const rootEnvPath = resolve(currentDir, '../../../.env');

if (existsSync(localEnvPath)) {
  loadEnv({ path: localEnvPath, override: true });
} else if (existsSync(rootEnvPath)) {
  loadEnv({ path: rootEnvPath, override: true });
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});