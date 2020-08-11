import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Icon from '../../shared/svgIcon';
import Spinner from '../../shared/spinner';
import { NORMAL_ICON_WIDTH } from '../../../utils';
import classes from './main-factors.module.scss';

function getFactorDescription(data) {
  const { area, amount } = data;
  return `Average waiting time in ${area} is ${amount} minutes`;
}

function MainFactors({ waitingFactors, loading }) {
  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>
            Main factors of waiting:
          </span>
        </div>
        {loading ? (
          <div className={cx(classes.spinnerContainer, 'Spinner_contained')}>
            <Spinner />
          </div>
        ) : (
          <div className={classes.contentWrapper}>
            {waitingFactors.length === 0 && (
              <div className={cx(classes.empty, 'text-normal')}>
                <FormattedMessage
                  id="home_dashboard__not_enough_data"
                  defaultMessage="Not enough data to show yet."
                />
                <div className={classes.line} />
              </div>
            )}
            {waitingFactors.map((row) => (
              <div className={classes.factor} key={row.id}>
                <div className={classes.icon}>
                  <Icon
                    name="atm"
                    width={NORMAL_ICON_WIDTH}
                    height={NORMAL_ICON_WIDTH}
                  />
                </div>
                <div className={cx(classes.label, 'text-small')}>
                  {row.area}
                </div>
                <div className={cx(classes.description, 'text-small')}>
                  {getFactorDescription(row)}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}

MainFactors.propTypes = {
  waitingFactors: PropTypes.arrayOf(PropTypes.shape),
  loading: PropTypes.bool,
};

MainFactors.defaultProps = {
  waitingFactors: [],
  loading: false,
};

export default React.memo(MainFactors);
