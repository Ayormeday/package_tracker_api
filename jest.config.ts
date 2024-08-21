module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  automock: false,
  // setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    "^@models/(.*)$": "<rootDir>/src/models/$1"
  }
};