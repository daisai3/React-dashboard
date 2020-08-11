import React from 'react';
import PropTypes from 'prop-types';
import { scss } from '../../utils';
import classes from './customers-list.module.scss';

function CustomersList({
  customers = [],
  selectedCustomer,
  setSelectedCustomer,
}) {
  return customers.length > 0 ? (
    customers.map((customer) => (
      <button
        data-testid="customer-card"
        type="button"
        onClick={() => {
          setSelectedCustomer(customer);
        }}
        key={customer.global_identity}
        className={scss(
          classes.customerCard,
          selectedCustomer?.global_identity === customer.global_identity
            ? classes.activeCard
            : '',
        )}
      >
        <div />
        {customer.global_identity}
      </button>
    ))
  ) : (
    <div className={classes.emptyWrapper}>
      There are no clients at the moment
    </div>
  );
}

CustomersList.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      center_name: PropTypes.string,
      epoch_second: PropTypes.number,
      global_identity: PropTypes.string,
      area: PropTypes.string,
      position_x: PropTypes.number,
      position_y: PropTypes.number,
    }),
  ).isRequired,
  setSelectedCustomer: PropTypes.func.isRequired,
  selectedCustomer: PropTypes.shape({
    center_name: PropTypes.string,
    epoch_second: PropTypes.number,
    global_identity: PropTypes.string,
    area: PropTypes.string,
    position_x: PropTypes.number,
    position_y: PropTypes.number,
  }),
};

export default CustomersList;
