import { mergeConfig } from '../util';

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
