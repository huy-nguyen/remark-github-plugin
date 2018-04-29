import sortBy from 'lodash-es/sortBy';
import sortedUniq from 'lodash-es/sortedUniq';
import {parse} from 'parse-numeric-range';

export const lineTerminator = '\n';

interface ILine {
  number: number;
  content: string;
}

// Position `content` at the same level of indentation as `prevLine`:
const addLeadingIndentation = (prevLine: string, currentLine: string): string => {
  const matched = prevLine.match(/^([ \t]+).*/);
  if (matched === null) {
    return currentLine;
  } else {
    const [, indentation] = matched;
    return `${indentation}${currentLine}`;
  }
};

export const extractLines = (
    rawFileContent: string,
    range: string,
    headerLines: string[],
    ellipsisComment?: string): string => {
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

  const result: string[] = headerLines;
  let prevLine: ILine | undefined;
  for (const currentLineNumber of lineNumbers) {
    if (ellipsisComment !== undefined) {
      // Insert ellipsis comment if the currently processed line is not
      // right after the last processed line OR if the first line is not included
      // in the range:
      if (prevLine !== undefined && prevLine.number < currentLineNumber - 1) {
        const {content} = prevLine;
        result.push(addLeadingIndentation(content, ellipsisComment));
      } else if (prevLine === undefined && currentLineNumber > 1) {
        result.push(ellipsisComment);
      }
    }
    const retrievedLine = rawLines[currentLineNumber - 1];
    if (retrievedLine !== undefined) {
      result.push(retrievedLine);
      prevLine = {
        number: currentLineNumber,
        content: retrievedLine,
      };
    }
  }

  // Insert an ellipsis comment if line subset ends before end of file:
  if (prevLine !== undefined &&
      prevLine.number < adjustedLinesLength &&
      ellipsisComment !== undefined) {

    result.push(addLeadingIndentation(prevLine.content, ellipsisComment));
  }

  return result.join(lineTerminator);
};
