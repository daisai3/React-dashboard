import React from 'react';
import { render } from '@testing-library/react';
import { MockContext } from '../../components/mock-context';
import Register from './index';

test('renders login-page', () => {
  const { getByTestId } = render(
    <MockContext initialState={{ user: true }}>
      <Register />
    </MockContext>,
  );
  const linkElement = getByTestId('register-page');
  expect(linkElement).toBeInTheDocument();
});
