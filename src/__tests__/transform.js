import getTestSuite, {
  testTypes,
} from './getTestSuite';

// eslint-disable-next-line jest/valid-describe
describe('Remark transformer', getTestSuite(testTypes.normal));
