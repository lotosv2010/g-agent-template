/** @type {import('ts-jest').JestConfigWithTsJest} */
const nextJest = await import('next/jest');

const createJestConfig = nextJest.default({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@g-agent-template/contracts/(.*)$': '<rootDir>/../../packages/contracts/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
};

export default createJestConfig(customJestConfig);
