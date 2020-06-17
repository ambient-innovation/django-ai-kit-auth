import { tFactory, Strings } from '..';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import en from '../en/auth.json';

test('tFactory returns function', () => {
  const t = tFactory(en);
  expect(typeof t).toEqual('function');
});

test('t returns correct strings', () => {
  const mockStrings: Strings = {
    ...en,
    Common: {
      ...en.Common,
      ok: 'MockOK',
    },
  };
  const t = tFactory(mockStrings);
  expect(t('auth:Common.ok')).toEqual(mockStrings.Common.ok);
});

test.each([
  'auth:Common.okay',
  'authCommon.okay',
  'auth:Common.ok.no',
  'auth:Common',
])('t returns key if key is incorrect (%s)', (key) => {
  const t = tFactory(en);
  expect(t(key)).toEqual(key);
});
