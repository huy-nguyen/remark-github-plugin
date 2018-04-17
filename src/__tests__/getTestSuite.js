import fs from 'fs';
import path from 'path';
import remark from 'remark';
import nodeFetch from 'node-fetch';
import Cache from 'async-disk-cache';

export const testTypes = {
  normal: 'normal',
  buildLib: 'buildLib',
};

export default (testType) => {
  let getAttacher;
  if (testType === testTypes.normal) {
    getAttacher = require('../index').getAttacher;
  } else if (testType === testTypes.buildLib) {
    getAttacher = require('../../lib/index').getAttacher;
  }

  return () => {
    const fixtureDirName = '__fixtures__';
    const inputFileName = 'input.md';
    const expectedFileName = 'expected.md';
    const configFileName = 'config.js';
    const cacheDirName = 'cache';

    const fixturesDir = path.resolve(path.join(__dirname, '..'), fixtureDirName);
    const names = fs.readdirSync(fixturesDir);

    // Only keep directories, not files:
    const directories = [];
    for (const name of names) {
      const fullPath = path.join(fixturesDir, name);
      if (fs.lstatSync(fullPath).isDirectory() === true) {
        directories.push(name);
      }
    }

    // Generate tests programatically:
    for (const directory of directories) {
      const caseName = directory.split('-').join(' ');
      test(caseName, async (done) => {
        const fixtureDir = path.join(fixturesDir, directory);

        const inputFilePath = path.join(fixtureDir, inputFileName);
        const input = fs.readFileSync(inputFilePath, 'utf8');

        const expectedFilePath = path.join(fixtureDir, expectedFileName);
        const expected = fs.readFileSync(expectedFilePath, 'utf8');

        const cacheDir = path.join(fixtureDir, cacheDirName);

        const optionsFilePath = path.join (fixtureDir, configFileName);
        let options, testConfig;
        try {
          testConfig = require(optionsFilePath);
          options = testConfig.pluginOptions;
        } catch(e) {
          options = {};
          testConfig = {};
        }

        const mockFetch = jest.fn((...args) => nodeFetch(...args));

        // Create a cache we can totally control so that we can
        // clean up later:
        let mockCache;
        if (options.useCache) {
          mockCache = new Cache(options.cacheKey, {
            location: cacheDir,
          });
          await mockCache.clear();
        }
        const plugin = getAttacher({
          _fetch: mockFetch,
          _cache: mockCache,
        });

        const processor = remark().data(
          // Need this setting so that code blocks with no language is rendered as
          // code blocks:
          'settings', {fences: true}).use(plugin, options,
        );
        processor.process(input, async (err, actual) => {
          if (err) {
            throw new Error(err);
          }

          expect(actual && actual.contents).toEqual(expected);

          if (testConfig.assertFetchCalls) {
            if (typeof testConfig.assertFetchCalls === 'number') {
              expect(mockFetch.mock.calls).toHaveLength(testConfig.assertFetchCalls);
            }
          }

          if (options.useCache) {
            await mockCache.clear();
          }
          done();
        });
      });
    }
  };
};
