module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/shared', '<rootDir>/server'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1'
  },
  collectCoverageFrom: [
    'shared/**/*.ts',
    'server/**/*.ts',
    '!**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
