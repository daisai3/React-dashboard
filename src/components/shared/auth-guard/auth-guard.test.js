import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthGuard from './index';
import { MockContext } from '../../mock-context';

const TestComponent = () => <div>test-component</div>;

test('auth guard with no user should redirect', () => {
  render(
    <MockContext value={{ user: false }}>
      <AuthGuard Component={TestComponent} />
    </MockContext>,
  );

  expect(screen.queryByText('test-component')).toBeNull();
});

test('auth guard with user should render prop', () => {
  render(
    <MockContext initialState={{ user: { role: true } }}>
      <AuthGuard Component={TestComponent} />
    </MockContext>,
  );
  expect(screen.queryByText('test-component')).toBeInTheDocument();
});
