import * as React from 'react';
import { Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { waitForElement } from '@testing-library/react';

import { renderWithRouterAndUser } from './Util';
import { ActivateEmailAddress, makeActivateEmailAddress } from '../ActivateEmailAddress';
import { strings } from '../../internationalization';

// eslint-disable-next-line jest/expect-expect
test('shows success message', async () => {
  const renderObject = renderWithRouterAndUser(
    <Route path="/activate/:ident/:token">
      <ActivateEmailAddress />
    </Route>,
    { activateEmailAddress: () => new Promise<void>((resolve) => resolve()) },
    ['/activate/1234/1234-1234'],
  );
  await waitForElement(() => renderObject.getByText(strings.EmailActivation.SuccessText));
});

// eslint-disable-next-line jest/expect-expect
test('shows error message', async () => {
  const renderObject = renderWithRouterAndUser(
    <Route path="/activate/:ident/:token">
      <ActivateEmailAddress />
    </Route>,
    {
      activateEmailAddress: () => new Promise<void>(() => {
        // eslint-disable-next-line no-throw-literal
        throw {
          response: {
            status: 400,
            data: { error: 'activation_link_invalid' },
          },
        };
      }),
    },
    ['/activate/1234/1234-1234'],
  );
  await waitForElement(() => renderObject.getByText(
    strings.EmailActivation.Errors.activation_link_invalid,
  ));
});

const sleep = () => new Promise<void>((r) => { setTimeout(r, 200); });

// eslint-disable-next-line jest/expect-expect
test('shows loading indicator', async () => {
  const CustomActivate = makeActivateEmailAddress({
    loadingIndicator: () => <div>loading</div>,
  });
  const renderObject = renderWithRouterAndUser(
    <Route path="/activate/:ident/:token">
      <CustomActivate />
    </Route>,
    { activateEmailAddress: sleep },
    ['/activate/1234/1234-1234'],
  );
  await waitForElement(() => renderObject.getByText('loading'));
});
