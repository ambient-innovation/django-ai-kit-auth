import * as React from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from 'axios-mock-adapter';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent, waitForElement } from '@testing-library/react';

import { ActivateEmailAddress } from '../ActivateEmailAddress';

const maxios = new MockAdapter(axios);

beforeEach(() => {
  maxios.reset();
});

test('shows success message', () => {
  maxios.onPost(new RegExp('/authenticate/.*/.*/'))
    .reply(200);
});
