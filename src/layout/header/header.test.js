/* eslint-disable no-console */
import React from 'react';
import { render } from '@testing-library/react';
import { MockContext } from '../../components/mock-context';

import Header from './index';

test('Header renders successfully', () => {
  const { container } = render(
    <MockContext initialState={{}}>
      <Header />
    </MockContext>,
  );
  expect(container).toBeInTheDocument();
});
