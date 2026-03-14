import type { Config } from 'jest';
import { nestConfig } from '@repo/jest-config';

const config: Config = {
  ...nestConfig,
  moduleNameMapper: {
    '^@repo/redis-client$':
      '<rootDir>/../../../packages/redis-client/src/index.ts',
    '^@repo/shared-types$':
      '<rootDir>/../../../packages/shared-types/src/index.ts',
    '^@repo/prisma-client$':
      '<rootDir>/../../../packages/prisma-client/src/index.ts',
  },
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [2307],
        },
      },
    ],
  },
};

export default config;
