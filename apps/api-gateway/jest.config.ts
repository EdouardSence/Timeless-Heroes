import type { Config } from 'jest';
import { nestConfig } from '@repo/jest-config';

const config: Config = {
  ...nestConfig,
};

export default config;
