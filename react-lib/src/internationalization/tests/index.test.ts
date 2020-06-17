import { tFactory, Strings } from '..';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import en from '../en/auth.json';

test('tFactory returns function', () => {
  const t = tFactory(en);
  expect(typeof t).toEqual('function');
});

test('t returns correct strings', () => {
  const e = tFactory(en);
  const customKey = 'auth:Common.ok';
  const customValue = `habibi`;
  const t = (key: string) => {
    if (key === customKey) return customValue;

    return e(key);
  };
  expect(t('auth:Common.ok')).toEqual(customValue);
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
