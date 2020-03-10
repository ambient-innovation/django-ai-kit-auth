import * as React from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from 'axios-mock-adapter';
// eslint-disable-next-line import/no-extraneous-dependencies
import { waitForElement } from '@testing-library/react';

import { UserContext as StandardUserContext } from '../../store/UserStore';
import { renderWithRouterAndUser } from './Util';
import { ActivateEmailAddress, makeActivateEmailAddress } from '../ActivateEmailAddress';
import { strings } from '../../internationalization';

const maxios = new MockAdapter(axios);

const sleep = async () => new Promise((r) => setTimeout(r, 200));

beforeEach(() => {
  maxios.reset();
});

// eslint-disable-next-line jest/expect-expect
test('shows success message', async () => {
  maxios.onPost(new RegExp('/activate_email/'))
    .reply(200);
  const renderObject = renderWithRouterAndUser(
    <Route path="/activate/:ident/:token">
      <ActivateEmailAddress />
    </Route>,
    undefined,
    false,
    ['/activate/1234/1234-1234'],
  );
  await waitForElement(() => renderObject.getByText(strings.EmailActivation.SuccessText));
});

// eslint-disable-next-line jest/expect-expect
test('shows error message', async () => {
  maxios.onPost(new RegExp('/activate_email/'))
    .reply(400, { error: 'activation_link_invalid' });
  const renderObject = renderWithRouterAndUser(
    <Route path="/activate/:ident/:token">
      <ActivateEmailAddress />
    </Route>,
    undefined,
    false,
    ['/activate/1234/1234-1234'],
  );
  await waitForElement(() => renderObject.getByText(
    strings.EmailActivation.Errors.activation_link_invalid,
  ));
});

// eslint-disable-next-line jest/expect-expect
test('shows loading indicator', async () => {
  maxios.onPost(new RegExp('/activate_email/'))
    .reply(async () => {
      await sleep();

      return [200];
    });
  const CustomActivate = makeActivateEmailAddress({
    userContext: StandardUserContext,
    loadingIndicator: () => <div>loading</div>,
  });
  const renderObject = renderWithRouterAndUser(
    <Route path="/activate/:ident/:token">
      <CustomActivate />
    </Route>,
    undefined,
    false,
    ['/activate/1234/1234-1234'],
  );
  await waitForElement(() => renderObject.getByText('loading'));
});
