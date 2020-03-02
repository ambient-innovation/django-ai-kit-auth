import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { LoginView } from '../LoginView';

test('renders login view', () => {
  const renderObject = render(<LoginView />);
  expect(renderObject.baseElement).toBeInTheDocument();
});
