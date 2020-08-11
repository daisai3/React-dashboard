import React from 'react';
import { render } from '@testing-library/react';
import { MockContext } from '../../mock-context';
import CameraConfigDashboard from '.';
import config from '../../../config';

test('renders center-manager-page', () => {
  const { getByTestId } = render(
    <MockContext initialState={{ user: { role: config.roles.LOCAL } }}>
      <CameraConfigDashboard />
    </MockContext>,
  );

  const linkElement = getByTestId('camera-config-page');
  expect(linkElement).toBeInTheDocument();
});
