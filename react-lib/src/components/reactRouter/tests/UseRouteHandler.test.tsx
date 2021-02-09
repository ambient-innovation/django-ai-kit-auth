import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { FC, useEffect } from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useRouteHandler } from '../useRouteHandler';

const newUrl = '/new/url';

const PushRouteHandler: FC = () => {
  const { push } = useRouteHandler();
  useEffect(() => push(newUrl), [push]);

  return null;
};

const ReplaceRouteHandler: FC = () => {
  const { replace } = useRouteHandler();
  useEffect(() => replace(newUrl), [replace]);

  return null;
};

const renderComponent = (element: JSX.Element) => {
  const history = createMemoryHistory({ initialEntries: ['/'] });

  return {
    history,
    ...render(
      <Router history={history}>
        {element}
      </Router>,
    ),
  };
};

test('push pushes to history', () => {
  const { history } = renderComponent(<PushRouteHandler />);
  expect(history.entries.length).toEqual(2);
  expect(history.entries[0].pathname).toEqual('/');
  expect(history.entries[1].pathname).toEqual(newUrl);
});

test('replace replaces last history entry', () => {
  const { history } = renderComponent(<ReplaceRouteHandler />);
  expect(history.entries.length).toEqual(1);
  expect(history.entries[0].pathname).toEqual(newUrl);
});
