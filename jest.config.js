export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/shared', '<rootDir>/server'],
  testMatch: ['**/*.test.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.test.json'
      },
    ],
  },
  collectCoverageFrom: [
    'shared/**/*.ts',
    'server/**/*.ts',
    '!**/*.d.ts',
    '!**/*.test.ts'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
