import React from 'react';
import { render } from '@testing-library/react';
import { MockContext } from '../../components/mock-context';
import Login from '.';

test('renders login-page', () => {
  const { getByTestId } = render(
    <MockContext initialState={{}}>
      <Login />
    </MockContext>,
  );
  const linkElement = getByTestId('login-page');
  expect(linkElement).toBeInTheDocument();
});
