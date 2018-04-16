import {parse} from 'parse-numeric-range';

export const extractLines = (rawFileContent: string, range: string): string => {
  const lineTerminator = '\n';
  const lines = rawFileContent.split(lineTerminator);
  const rawLineNumbers = parse(range);
  const lineNumbers = rawLineNumbers.filter(lineNumber => lineNumber > 0);

  const result = [];
  for (const lineNumber of lineNumbers) {
    const retrievedLine = lines[lineNumber - 1];
    if (retrievedLine !== undefined) {
      result.push(retrievedLine);
    }
  }

  return result.join(lineTerminator);
};
