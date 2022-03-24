import * as React from 'react';
import { FC } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, waitForElement } from '@testing-library/react';

import { makeActivateEmailAddress } from '../ActivateEmailAddress';
import { en } from '../../internationalization';
import { defaultApiConfig, getFullTestConfig } from '../../tests/Helper';
import { dontResolvePromise, makeGenericUserStore, MockUserStoreProps } from '../../store/UserStore';
import { DeepPartial } from '../../util';
import { FullConfig } from '../../config/components';

const { MockUserStore } = makeGenericUserStore(defaultApiConfig);

const renderComponent = (
  apiFunctions?: MockUserStoreProps, config?: DeepPartial<FullConfig>,
) => {
  const fullConfig = getFullTestConfig({
    ...config,
    routing: {
      useQueryParams: () => ({
        ident: '1234', token: '1234-1234',
      }),
      ...config?.routing,
    },
  });
  const { ActivateEmailAddress } = makeActivateEmailAddress(fullConfig);

  return {
    fullConfig,
    ...render(
      <MockUserStore {...apiFunctions}>
        <ActivateEmailAddress />
      </MockUserStore>,
    ),
  };
};

// eslint-disable-next-line jest/expect-expect
test('shows success message', async () => {
  const renderObject = renderComponent(
    { activateEmailAddress: () => Promise.resolve() },
  );
  await waitForElement(() => renderObject.getByText(en('auth:EmailActivation.SuccessText')));
});

// eslint-disable-next-line jest/expect-expect
test('shows error message', async () => {
  const renderObject = renderComponent(
    {
      // eslint-disable-next-line prefer-promise-reject-errors
      activateEmailAddress: () => Promise.reject({
        response: {
          status: 400,
          data: { error: 'activation_link_invalid' },
        },
      }),
    },
  );
  await waitForElement(() => renderObject.getByText(
    en('auth:EmailActivation.Errors.activation_link_invalid'),
  ));
});

// eslint-disable-next-line jest/expect-expect
test('shows loading indicator', async () => {
  const renderObject = renderComponent(
    { activateEmailAddress: dontResolvePromise },
    {
      components: { loadingIndicator: (() => <div>loading</div>) as FC },
    },
  );
  await waitForElement(() => renderObject.getByText('loading'));
});
