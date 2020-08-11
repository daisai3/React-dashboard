import React from 'react';
import { render } from '@testing-library/react';
import { MockContext } from '../../mock-context';
import CenterInfoStage from '.';
import config from '../../../config';

test('renders camera config form', () => {
  const { getByTestId } = render(
    <MockContext initialState={{ user: { role: config.roles.LOCAL } }}>
      <CenterInfoStage
        center={{
          distance_points: [
            [1, 1],
            [1, 1],
          ],
        }}
        stage={0}
        setStage={() => {}}
        updateForm={() => {}}
      />
    </MockContext>,
  );
  const configForm = getByTestId('center-config-form');
  expect(configForm).toBeInTheDocument();
});
