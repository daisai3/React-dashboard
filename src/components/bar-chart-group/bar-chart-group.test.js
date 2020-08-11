import React from 'react';
import { render } from '@testing-library/react';
import { MockContext } from '../mock-context';
import BarChartGroup from '.';

const AMOUNT_OF_BAR_CHARTS = 2;

test('renders bar chart group wrapper', () => {
  const { queryAllByTestId } = render(
    <MockContext>
      <BarChartGroup customers={[]} />
    </MockContext>,
  );
  const barCharts = queryAllByTestId('barchart-wrapper');
  expect(barCharts.length).toBe(AMOUNT_OF_BAR_CHARTS);
});
