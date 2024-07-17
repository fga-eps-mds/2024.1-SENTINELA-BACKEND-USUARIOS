/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/?(*.)+(spec|test).mjs'
  ],
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest', // Certifique-se de ter babel-jest instalado se você usa babel
  },
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
};

module.exports = config;
