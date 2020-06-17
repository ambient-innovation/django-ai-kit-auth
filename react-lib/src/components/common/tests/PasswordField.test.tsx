import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@testing-library/dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { PasswordField } from '../PasswordField';
import { en } from '../../../internationalization';

const renderFunction = (
  element: JSX.Element = <PasswordField translator={en} password="" errorMessage={{ password: ['blank'] }} />,
) => render(element);

test('password visibility', () => {
  const renderObject = renderFunction();
  expect(renderObject.getByLabelText(en('auth:Common.Password')))
    .toHaveProperty('type', 'password');
  fireEvent.click(renderObject.getByLabelText('toggle password visibility'));
  expect(renderObject.getByLabelText(en('auth:Common.Password')))
    .toHaveProperty('type', 'text');
  fireEvent.click(renderObject.getByLabelText('toggle password visibility'));
  expect(renderObject.getByLabelText(en('auth:Common.Password')))
    .toHaveProperty('type', 'password');
});

test('password error messages', () => {
  const renderObject = renderFunction();
  expect(renderObject.getByText(en('auth:Common.FieldErrors.blank'))).toBeInTheDocument();
});
