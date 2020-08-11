import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import classes from './customer-list.module.scss';

function CustomerList({ onExpand }) {
  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>
            <FormattedMessage
              id="customer_dashboard__insight_list_of_customers_title"
              defaultMessage="List of Customers & Visitors"
            />
          </span>

          <span className={cx(classes.description, 'text-small')}>
            <FormattedMessage
              id="customer_dashboard__insight_list_of_customers_description"
              defaultMessage="See all the details of your cutomers & visitors in the center."
            />
          </span>
        </div>
        <div className={classes.content}>
          <button
            type="button"
            className={cx(classes.linkButton, 'text-small')}
            onClick={onExpand}
          >
            <FormattedMessage id="see_details" defaultMessage="See details" />
          </button>
        </div>
      </SectionWrapper>
    </div>
  );
}

CustomerList.propTypes = {
  onExpand: PropTypes.func,
};

CustomerList.defaultProps = {
  onExpand: () => {},
};
export default React.memo(CustomerList);
