import React from 'react';
// import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import classes from './empty-label.module.scss';

function EmptyLabel({ msg }) {
  return (
    <div className={classes.emptyWrapper}>
      <div className={cx(classes.empty, 'text-normal')}>
        {msg || (
          <FormattedMessage
            id="home_dashboard__not_enough_data"
            defaultMessage="Not enough data to show yet."
          />
        )}
        <div className={classes.line} />
      </div>
    </div>
  );
}

EmptyLabel.propTypes = {};
EmptyLabel.defaultProps = {};

export default React.memo(EmptyLabel);
