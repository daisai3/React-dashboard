import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import JourneyStages from './index';

jest.mock('../../services/timeline.service', () => ({
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
}));

test('Fetch and load stages', async () => {
  const selectedCustomer = 'C-0010';
  const { queryAllByTestId } = render(
    <JourneyStages selectedCustomerId={selectedCustomer} />,
  );

  await waitForElement(() => queryAllByTestId('stage'));
  const numberOfDifferentStages = 3;
  expect(queryAllByTestId('stage').length).toBe(numberOfDifferentStages);
});
