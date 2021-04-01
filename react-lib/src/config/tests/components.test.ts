import { DefaultConfig, makeComponents } from '../components';
import { getFullTestConfig } from '../../tests/Helper';

test.each<keyof DefaultConfig['paths']>([
  'login',
  'register',
  'activation',
  'forgotPassword',
  'resetPassword',
  'emailSent',
])('makeComponents prepends base to %s path', (key) => {
  const { fullConfig } = makeComponents(getFullTestConfig());
  expect(fullConfig.paths[key].startsWith(fullConfig.paths.base)).toBeTruthy();
});

test.each<keyof DefaultConfig['paths']>(
  ['mainPage', 'base'],
)('makeComponents does not prepent %s', (key) => {
  const inputConfig = getFullTestConfig();
  const { fullConfig } = makeComponents(inputConfig);
  expect(fullConfig.paths[key]).toEqual(inputConfig.paths[key]);
});
