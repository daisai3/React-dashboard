import React from 'react';
import { render } from '@testing-library/react';
import CustomersList from '.';

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

test('renders customers list cards', () => {
  const { queryAllByTestId } = render(
    <CustomersList customers={mockCustomers} setSelectedCustomer={() => {}} />,
  );
  const customersCards = queryAllByTestId('customer-card');
  expect(customersCards.length).toBe(mockCustomers.length);
});
