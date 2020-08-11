import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './index';

test('Spinner renders succesfully', () => {
  const { getByTestId } = render(<Spinner />);
  expect(getByTestId('spinner')).toBeInTheDocument();
});
