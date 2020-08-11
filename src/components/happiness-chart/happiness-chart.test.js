import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HappinessChart from '.';

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
}));

const numberOfDots = 10;

test('Fetch and load happiness line', async () => {
  const selectedCustomer = 'C-0010';
  const { queryAllByTestId, getByTestId } = render(
    <HappinessChart
      width={600}
      height={300}
      innerHeight
      selectedCustomerId={selectedCustomer}
    />,
  );

  await waitForElement(() => queryAllByTestId('hx-chart'));
  expect(queryAllByTestId('chart-circle').length).toBe(numberOfDots);
  expect(getByTestId('chart-line')).toBeInTheDocument();
});
