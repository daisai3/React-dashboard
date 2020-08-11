import React from 'react';
import { render } from '@testing-library/react';
import CustomersMap from '.';
import dewaFloor from '../../assets/images/DEWA_FloorPlan-01.png';

const mockCustomers = [
  {
    center_name: 'Headquarters',
    epoch_second: 123123123,
    global_identity: 'C-0001',
    area: 'Test',
    position_x: 40,
    position_y: 60,
  },
  {
    center_name: 'Headquarters',
    epoch_second: 123123123,
    global_identity: 'C-0002',
    area: 'Test',
    position_x: 50,
    position_y: 50,
  },
  {
    center_name: 'Headquarters',
    epoch_second: 123123123,
    global_identity: 'C-0003',
    area: 'Test',
    position_x: 60,
    position_y: 40,
  },
];

test('renders customers dots on map', () => {
  const { queryAllByTestId } = render(
    <CustomersMap
      customers={mockCustomers}
      setSelectedCustomer={() => {}}
      selectedCustomer={{ global_identity: 'C-0003' }}
      map={dewaFloor}
    />,
  );
  const customersDots = queryAllByTestId('customer-dot');
  expect(customersDots.length).toBe(mockCustomers.length);
});
