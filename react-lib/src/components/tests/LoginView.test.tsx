import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { AuthView } from '../AuthView';

test('renders login view', () => {
  const renderObject = render(<AuthView />);
  expect(renderObject.baseElement).toBeInTheDocument();
});
