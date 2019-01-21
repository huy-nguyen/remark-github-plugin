import getTestSuite, {
  testTypes,
} from './getTestSuite';

// eslint-disable-next-line jest/valid-describe
describe('Build results', getTestSuite(testTypes.buildLib));
