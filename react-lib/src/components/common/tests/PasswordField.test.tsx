import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@testing-library/dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { strings } from '../../../internationalization';
import { PasswordField } from '../PasswordField';

const renderFunction = (
  element: JSX.Element = <PasswordField password="" errorMessage={{ password: ['blank'] }} />,
) => render(element);

test('password visibility', () => {
  const renderObject = renderFunction();
  expect(renderObject.getByLabelText(strings.Common.Password))
    .toHaveProperty('type', 'password');
  fireEvent.click(renderObject.getByLabelText('toggle password visibility'));
  expect(renderObject.getByLabelText(strings.Common.Password))
    .toHaveProperty('type', 'text');
  fireEvent.click(renderObject.getByLabelText('toggle password visibility'));
  expect(renderObject.getByLabelText(strings.Common.Password))
    .toHaveProperty('type', 'password');
});

test('password error messages', () => {
  const renderObject = renderFunction();
  expect(renderObject.getByText(strings.Common.FieldErrors.blank)).toBeInTheDocument();
});
