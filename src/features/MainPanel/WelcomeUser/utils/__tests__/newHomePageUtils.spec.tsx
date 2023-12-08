import { capitalizeFirstLetterOfEachWord } from "../newHomePageUtils";


test('capitalizes the first letter of each word in a sentence', () => {
  const input = 'hello world';
  const output = capitalizeFirstLetterOfEachWord(input);
  expect(output).toBe('Hello World');
});

test('handles an empty string', () => {
  const input = '';
  const output = capitalizeFirstLetterOfEachWord(input);
  expect(output).toBe('');
});

test('handles a single-word string', () => {
  const input = 'javascript';
  const output = capitalizeFirstLetterOfEachWord(input);
  expect(output).toBe('Javascript');
});

test('handles a sentence with already capitalized words', () => {
  const input = 'React is Awesome';
  const output = capitalizeFirstLetterOfEachWord(input);
  expect(output).toBe('React Is Awesome');
});

test('handles a sentence with mixed cases', () => {
  const input = 'thE quIck bRoWn foX';
  const output = capitalizeFirstLetterOfEachWord(input);
  expect(output).toBe('The Quick Brown Fox');
});