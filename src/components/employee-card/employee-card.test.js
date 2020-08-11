import React from 'react';
import { render } from '@testing-library/react';
import EmployeeCard from '.';
import { MockContext } from '../mock-context';

test('renders login-page', () => {
  const { getByTestId } = render(
    <MockContext>
      <EmployeeCard
        employee={{
          center_name: 'Headquarters',
          designated_zone_name: 'D-25',
          email: 'test_user@test.com',
          is_active: 'Active',
          job_title: 'Tester',
          language: 'En',
          name: 'Tester',
          photo: null,
          working_hours: 'Fulltime',
        }}
      />
    </MockContext>,
  );
  const linkElement = getByTestId('employee-card');
  expect(linkElement).toBeInTheDocument();
});
