import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Avatar from './index';
import placeholderImg from '../../../assets/images/avatar-placeholder.jpg';

test('avatar renders with placeholder no image is given', () => {
  render(<Avatar />);
  expect(screen.queryByTestId('avatar').src).toEqual(
    `http://localhost/${placeholderImg}`,
  );
});

test('avatar renders correctly', () => {
  render(<Avatar image={placeholderImg} />);
  expect(screen.queryByTestId('avatar').src).toEqual(
    `http://localhost/${placeholderImg}`,
  );
});

test('avatar uses fallback on error', () => {
  const { getByTestId } = render(<Avatar image="broken link" />);
  const image = getByTestId('avatar');
  act(() => {
    image.dispatchEvent(new Event('error'));
  });
  expect(image.src).toEqual(`http://localhost/${placeholderImg}`);
});
