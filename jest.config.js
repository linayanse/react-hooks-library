module.exports = {
  setupFiles: [
    '<rootDir>/jest/setupTests.js',
  ],
  // snapshotSerializers: ['enzyme-to-json/serializer'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^(?!.*\\.(js|jsx|mjs|css|json)$)': '<rootDir>/jest/fileTransform.js'
  },
  testMatch: [
    '<rootDir>/tests/**/?(*.)(spec|test).(j|t)s?(x)'
  ],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'
  ],
  moduleFileExtensions: [
    'mjs',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'web.js',
    'js',
    'web.jsx',
    'jsx',
    'json',
    'node',
    'mjs',
    'd.ts'
  ],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.test.json'
    }
  },
  preset: 'ts-jest'
};