import React from 'react';
import { render } from '@testing-library/react';
import { MockContext } from '../../components/mock-context';
import NavigationPanel from '.';
import config from '../../config';

const CENTER_MANAGER_LINKS = 4;
const OFFICER_LINKS = 0;

test('Center Manager Links', () => {
  const { queryAllByTestId } = render(
    <MockContext initialState={{ user: { role: config.roles.LOCAL } }}>
      <NavigationPanel location={{ pathname: '/' }} />
    </MockContext>,
  );
  const linkElement = queryAllByTestId('nav-link');
  expect(linkElement.length).toBe(CENTER_MANAGER_LINKS);
});

test('Officer Links', () => {
  const { queryAllByTestId } = render(
    <MockContext initialState={{ user: { role: config.roles.EMPLOYEE } }}>
      <NavigationPanel location={{ pathname: '/' }} />
    </MockContext>,
  );
  const linkElement = queryAllByTestId('nav-link');
  expect(linkElement.length).toBe(OFFICER_LINKS);
});
