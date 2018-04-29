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
line 7
  line 8
`;

describe('When ellipsis comment is NOT provided', () => {
  test('when line range is in order', () => {
    const actual = extractLines(fileContent, '1,3-5', []);
    const expected =
`line 1
line 3
  line 4
line 5`;
    expect(actual).toEqual(expected);
  });

  test('when line range is out of order', () => {
    const actual = extractLines(fileContent, '3-5,1', []);
    const expected =
`line 1
line 3
  line 4
line 5`;
    expect(actual).toEqual(expected);
  });
});

describe('When ellipsis comment is provided', () => {
  test('First line is not included in range', () => {
    const actual = extractLines(fileContent, '2-8', [], 'comment');
    const expected =
`comment
  line 2
line 3
  line 4
line 5
  line 6
line 7
  line 8`;
    expect(actual).toEqual(expected);
  });

  test('Last line is not included in range', () => {
    const actual = extractLines(fileContent, '1-5', [], 'comment');
    const expected =
`line 1
  line 2
line 3
  line 4
line 5
comment`;
    expect(actual).toEqual(expected);
  });

  test('Intermediate lines not included in range', () => {
    const actual = extractLines(fileContent, '1-2,4-6,8', [], 'comment');
    const expected =
`line 1
  line 2
  comment
  line 4
line 5
  line 6
  comment
  line 8`;
    expect(actual).toEqual(expected);
  });
});
