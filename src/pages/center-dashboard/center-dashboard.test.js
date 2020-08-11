import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { MockContext } from '../../components/mock-context';
import CenterDashboard from '.';
import config from '../../config';

jest.mock('../../services/center.service', () => ({
  getCenter: () =>
    Promise.resolve({
      data: {
        customer_list: [
          {
            age_range: '19-49',
            center_name: 'Headquarters',
            epoch_second: 1586241800,
            ethnicity: 'Local',
            gender: 'Male',
            global_identity: 'C-0001',
            happiness_index: 68,
            area: 'Waiting',
            position_x: 45.093859523408156,
            position_y: 68.80142662127338,
          },
        ],
        employee_list: [
          {
            center_name: 'Headquarters',
            designated_zone_name: 'D-25',
            email: 'maximiliano.casale@dive.tech',
            is_active: 'Active',
            job_title: 'Fullstack Dev',
            language: 'en',
            name: 'Max Casale',
            photo: null,
            working_hours: 'Fulltime',
          },
        ],
        lat: 55.12312316894531,
        lng: 75.12312316894531,
        location: 'Dubai',
        name: 'Headquarters',
      },
    }),
}));

test('renders center-manager-page', async () => {
  const { getByTestId } = render(
    <MockContext initialState={{ user: { role: config.roles.local } }}>
      <CenterDashboard />
    </MockContext>,
  );

  await waitForElement(() => getByTestId('center-manager-page'));
  const linkElement = getByTestId('center-manager-page');
  expect(linkElement).toBeInTheDocument();
});
