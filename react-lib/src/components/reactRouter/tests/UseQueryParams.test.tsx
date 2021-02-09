import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { FC } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useQueryParams } from '../useQueryParams';

const QueryParamComponent: FC = () => {
  const params = useQueryParams();

  return (
    <div>
      {Object.entries(params).map(([key, value]) => (
        <p key={key}>{`${key}=${value}`}</p>
      ))}
    </div>
  );
};

const renderComponent = (initialEntry: string) => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <QueryParamComponent />
  </MemoryRouter>,
);

test.each<[string, string[]]>([
  ['/?a=b', ['a=b']],
  ['/some/path?a=b&c=d', ['a=b', 'c=d']],
  ['/?a=b&a=d', ['a=d']],
])('all params from route %s are found', (route, params) => {
  expect.assertions(params.length);
  const { getByText } = renderComponent(route);
  params.forEach((param) => expect(getByText(param)).toBeVisible());
});
