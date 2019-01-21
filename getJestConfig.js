exports.getJestConfig = (isCI) => {
  let testPathIgnorePatterns = ['/node_modules/', 'src/__tests__/getTestSuite.js'];
  if (isCI === false) {
    testPathIgnorePatterns = [
      ...testPathIgnorePatterns,
      'src/__tests__/buildResults.js',
    ];
  }
  return {
    transform: {
      '^.+\\.tsx?$': 'babel-jest',
      '^.+\\.jsx?$': 'babel-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    coveragePathIgnorePatterns: ['/node_modules/', 'setupTests.js', '__fixtures__'],
    testPathIgnorePatterns,
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
};
