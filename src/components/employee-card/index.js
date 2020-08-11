import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Avatar from '../shared/avatar';

import classes from './employee-card.module.scss';
import { scss } from '../../utils';

function EmployeeCard({ employee }) {
  return (
    <div className={classes.cardWrapper} data-testid="employee-card">
      <div className={classes.imgWrapper}>
        <Avatar image={employee.photo} />
      </div>
      <div className={classes.descriptionWrapper}>
        <div>{employee.name}</div>
        <span>
          <FormattedMessage
            id="employee_card__desk_tag"
            defaultMessage={`Desk: {zone}`}
            values={{
              zone: (
                <span className={scss('Global_text_blue')}>
                  {employee.designated_zone_name}
                </span>
              ),
            }}
          />
        </span>
        <span>
          <FormattedMessage
            id="status"
            defaultMessage={`Status: {status}`}
            values={{
              status: (
                <span
                  className={scss(
                    employee.is_active === 'Active'
                      ? 'Global_text_green'
                      : 'Global_text_red',
                    'Global_bold',
                  )}
                >
                  {employee.is_active}
                </span>
              ),
            }}
          />
        </span>
      </div>
    </div>
  );
}

EmployeeCard.propTypes = {
  employee: PropTypes.shape({
    center_name: PropTypes.string,
    designated_zone_name: PropTypes.string.isRequired,
    email: PropTypes.string,
    is_active: PropTypes.string.isRequired,
    job_title: PropTypes.string,
    language: PropTypes.string,
    name: PropTypes.string.isRequired,
    photo: PropTypes.string,
    working_hours: PropTypes.string,
  }),
};

export default EmployeeCard;
