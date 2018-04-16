import {
  extractLines,
} from '../extractLines';

const fileContent =
`line 1
line 2
line 3
line 4
line 5
line 6
`;

test('Should extract correct lines', () => {
  const actual = extractLines(fileContent, '1,3-5');
  const expected =
`line 1
line 3
line 4
line 5`;
  expect(actual).toEqual(expected);
});
