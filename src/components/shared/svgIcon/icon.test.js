/* eslint-disable no-console */
import React from 'react';
import { render } from '@testing-library/react';
import Icon from './index';

test('Icon renders successfully', () => {
  const { container } = render(<Icon name="example" />);
  expect(container).toBeInTheDocument();
});
