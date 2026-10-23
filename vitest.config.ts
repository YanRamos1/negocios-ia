import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['ferramentas/**/*.test.ts', 'src/**/*.test.ts'],
    environment: 'node',
  },
});
