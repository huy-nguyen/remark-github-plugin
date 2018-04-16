module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  coveragePathIgnorePatterns: ['/node_modules/', 'setupTests.js'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!lodash-es)',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
    'md',
  ],
  setupFiles: [
    '<rootDir>/src/setupTests.js',
  ],
};
