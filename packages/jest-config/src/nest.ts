import type { Config } from 'jest';
import { config as baseConfig } from './base';

export const nestConfig = {
  ...baseConfig,
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.service.ts',
    '**/*.controller.ts',
    '**/*.guard.ts',
    '**/*.gateway.ts',
    '**/*.worker.ts',
    '**/*.processor.ts',
    '!**/*.spec.ts',
    '!**/*.module.ts',
    '!**/main.ts',
    '!**/index.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '\\.dto\\.ts$',
    '\\.entity\\.ts$',
    '\\.interface\\.ts$',
    '\\.types\\.ts$',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
} as const satisfies Config;
