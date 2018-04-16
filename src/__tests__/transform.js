import fs from 'fs';
import path from 'path';
import remark from 'remark';
import plugin from '../index';

const fixtureDirName = '__fixtures__';
const inputFileName = 'input.md';
const expectedFileName = 'expected.md';

describe('Remark transformer', () => {
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
    test(caseName, (done) => {
      const fixtureDir = path.join(fixturesDir, directory);

      const inputFilePath = path.join(fixtureDir, inputFileName);
      const input = fs.readFileSync(inputFilePath, 'utf8');

      const expectedFilePath = path.join(fixtureDir, expectedFileName);
      const expected = fs.readFileSync(expectedFilePath, 'utf8');

      const processor = remark().use(plugin);
      processor.process(input, (err, actual) => {
        if (err) {
          throw new Error(err);
        }

        expect(actual && actual.contents).toEqual(expected);
        done();
      });
    });
  }

});
