import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { MockContext } from '../../components/mock-context';
import OfficerDashboard from './index';

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
        avg_waiting_time: 325,
        location: 'Dubai',
        name: 'Headquarters',
      },
    }),
}));

jest.mock('../../services/timeline.service', () => ({
  getHappinessTimeline: () =>
    Promise.resolve({
      data: [
        { timestamp: 1586171500, value: 85 },
        { timestamp: 1586171560, value: 88 },
        { timestamp: 1586171620, value: 87 },
        { timestamp: 1586171680, value: 87 },
        { timestamp: 1586171740, value: 87 },
        { timestamp: 1586171800, value: 88 },
        { timestamp: 1586171860, value: 93 },
        { timestamp: 1586171920, value: 93 },
        { timestamp: 1586171980, value: 93 },
        { timestamp: 1586172040, value: 90 },
      ],
    }),
  getStagesTimeline: () =>
    Promise.resolve({
      data: [
        { timestamp: 1586171500, type: 'Entry', value: 'Entry' },
        { timestamp: 1586171560, type: 'Waiting', value: 'Walking' },
        { timestamp: 1586171620, type: 'Waiting', value: 'Sitting' },
        { timestamp: 1586171680, type: 'Waiting', value: 'Sitting' },
        { timestamp: 1586171740, type: 'Waiting', value: 'Sitting' },
        { timestamp: 1586171800, type: 'Waiting', value: 'Walking' },
        { timestamp: 1586171860, type: 'Service', value: 'Speaking' },
        { timestamp: 1586171920, type: 'Service', value: 'Speaking' },
        { timestamp: 1586171980, type: 'Service', value: 'Speaking' },
        { timestamp: 1586172040, type: 'Entry', value: 'Entry' },
      ],
    }),
  getFootageTimeline: () =>
    Promise.resolve({
      data: [
        { timestamp: 1586171500, value: 85 },
        { timestamp: 1586171560, value: 88 },
        { timestamp: 1586171620, value: 87 },
        { timestamp: 1586171680, value: 87 },
        { timestamp: 1586171740, value: 87 },
        { timestamp: 1586171800, value: 88 },
        { timestamp: 1586171860, value: 93 },
        { timestamp: 1586171920, value: 93 },
        { timestamp: 1586171980, value: 93 },
        { timestamp: 1586172040, value: 90 },
      ],
    }),
}));

test('renders officer-page', async () => {
  const { getByTestId } = render(
    <MockContext initialState={{ user: { center_name: 'Headquarters' } }}>
      <OfficerDashboard />
    </MockContext>,
  );

  await waitForElement(() => getByTestId('officer-page'));
  const linkElement = getByTestId('officer-page');
  expect(linkElement).toBeInTheDocument();
});
