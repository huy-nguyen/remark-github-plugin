import sortBy from 'lodash-es/sortBy';
import sortedUniq from 'lodash-es/sortedUniq';
import {parse} from 'parse-numeric-range';

export const extractLines = (rawFileContent: string, range: string, ellipsisComment?: string): string => {
  const lineTerminator = '\n';
  const rawLines = rawFileContent.split(lineTerminator);
  const rawLinesLength = rawLines.length;

  // Many code files have an empty last line by convention, which is not visible
  // to the user. We strip this line out so that the calculation of whether to
  // include an ellipsis comment at the end of the subset is correct:
  let adjustedLines: string[];
  if (rawLines[rawLinesLength - 1] === '') {
    adjustedLines = rawLines.slice(0, rawLinesLength - 1);
  } else {
    adjustedLines = rawLines;
  }
  const adjustedLinesLength = adjustedLines.length;

  const rawLineNumbers = parse(range);
  const filteredLineNumbers = rawLineNumbers.filter(lineNumber => lineNumber > 0);
  const lineNumbers = sortedUniq(sortBy(filteredLineNumbers));

  const result: string[] = [];
  let prevLineNumber: number | undefined;
  for (const currentLineNumber of lineNumbers) {
    if (ellipsisComment !== undefined) {
      // Insert ellipsis comment if the currently processed line is not
      // right after the last processed line OR if the first line is not included
      // in the range:
      if (prevLineNumber !== undefined && prevLineNumber < currentLineNumber - 1) {
        result.push(ellipsisComment);
      } else if (prevLineNumber === undefined && currentLineNumber > 1) {
        result.push(ellipsisComment);
      }
    }
    const retrievedLine = rawLines[currentLineNumber - 1];
    if (retrievedLine !== undefined) {
      result.push(retrievedLine);
    }
    prevLineNumber = currentLineNumber;
  }

  // Insert an ellipsis comment if line subset ends before end of file:
  if (prevLineNumber !== undefined &&
      prevLineNumber < adjustedLinesLength &&
      ellipsisComment !== undefined) {

    result.push(ellipsisComment);
  }

  return result.join(lineTerminator);
};
