import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import Input from './index';

const testInput = (
  <Input
    label="Test input"
    value="test"
    onChange={() => {}}
    options={['test', 'test2']}
  />
);

test('input renders with read only', () => {
  const { getByTestId } = render(testInput);
  expect(getByTestId('readOnly-input')).toBeInTheDocument();
});

test('input toggles successfully', () => {
  const { getByTestId } = render(testInput);
  const button = getByTestId('toggle-input');
  const readOnlyP = getByTestId('readOnly-input');

  expect(readOnlyP).toBeInTheDocument();

  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const select = getByTestId('select-input');
  expect(select).toBeInTheDocument();
  expect(readOnlyP).not.toBeInTheDocument();
});
