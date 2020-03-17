import { mergeConfig, configureAuth } from '../Configuration';

test('config objects are properly merged', () => {
  const defaults = {
    a: {
      a1: 1, a2: 2, a3: 'test',
    },
    b: 'b',
    c: 'c',
  };
  expect(mergeConfig(defaults, { b: 'c', a: { a2: 3 } }))
    .toEqual({
      a: {
        a1: 1, a2: 3, a3: 'test',
      },
      b: 'c',
      c: 'c',
    });
});

// eslint-disable-next-line jest/expect-expect
test('all paths are properly configured', () => {
  // If paths are not configured properly, this call will raise an Error.
  // Therefore, no expect() statement needs to be given here
  configureAuth({});
});
