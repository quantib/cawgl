module.exports = {
  name: 'red-panda',
  testURL: 'http://localhost',
  testPathIgnorePatterns: [
    '<rootDir>/tests/utils/*',
    '<rootDir>/node_modules/',
  ],
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '^cawgl(.*)$': '<rootDir>/source/$1',
    '^@jest-utils(.*)$': '<rootDir>/tests/utils/$1',
  },
  maxConcurrency: 1,
  reporters: [
    'default',
  ],
  modulePaths: [
    '<rootDir>/node_modules/',
  ],
  runner: '@kayahr/jest-electron-runner',
  testEnvironment: '@kayahr/jest-electron-runner/environment',
};
