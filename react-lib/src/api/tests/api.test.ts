import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from 'axios-mock-adapter';
import { loginAPI, meAPI } from '../api';

const maxios = new MockAdapter(axios);

beforeEach(() => {
  maxios.reset();
});

test('login sets default csrf header', async () => {
  const csrf = 'aksjdhfalskdfhs';
  maxios.onPost('/login/').reply(200, { user: null, csrf });
  await loginAPI('', '', '');
  expect(axios.defaults.headers.common['X-CSRFToken']).toEqual(csrf);
});

test('me sets default csrf header', async () => {
  const csrf = 'aksjdhfalskdfhs';
  maxios.onGet('/me/').reply(200, { user: null, csrf });
  await meAPI('');
  expect(axios.defaults.headers.common['X-CSRFToken']).toEqual(csrf);
});
