import React from 'react';
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Button from './index';

const ANIMATION_FRAME = 300;

const mockObj = {
  mockPromise: () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(), ANIMATION_FRAME);
    }),
};

test('button async onClick success', async () => {
  const spy = jest.spyOn(mockObj, 'mockPromise');
  const { getByTestId, getByText } = render(
    <Button onClick={mockObj.mockPromise} async>
      Test Button
    </Button>,
  );
  expect(getByText('Test Button').textContent).toEqual('Test Button');
  const button = getByTestId('button');
  act(() => {
    fireEvent.click(button);
  });
  expect(spy).toBeCalled();
  const spinner = getByTestId('spinner');
  await waitForElementToBeRemoved(() => getByTestId('spinner'));
  expect(spinner).not.toBeInTheDocument();
});
