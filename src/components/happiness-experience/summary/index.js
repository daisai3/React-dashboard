import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Spinner from '../../shared/spinner';

import {
  getClassNameByPercentage,
  TOTAL_PERCENTAGE,
  FILTER_TYPES,
} from '../../../utils';
import classes from './summary.module.scss';

function getPercentage({ minValue, maxValue, avgValue }) {
  let minPercentage = 0;
  let maxPercentage = 0;
  let avgPercentage = 0;
  if (maxValue > 0) {
    maxPercentage = TOTAL_PERCENTAGE;
    minPercentage = (minValue * TOTAL_PERCENTAGE) / maxValue;
    avgPercentage = (avgValue * TOTAL_PERCENTAGE) / maxValue;
  }

  return {
    minPercentage,
    maxPercentage,
    avgPercentage,
  };
}

function Summary({
  isPadding,
  activeFilter,
  minValue,
  maxValue,
  avgValue,
  loading,
}) {
  const { minPercentage, maxPercentage, avgPercentage } = getPercentage({
    minValue,
    maxValue,
    avgValue,
  });

  return (
    <div className={cx(classes.mainContainer, isPadding ? 'grid-column' : '')}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-small')}>
            {`HX Summary of the ${FILTER_TYPES[activeFilter]}`}
          </span>
        </div>
        <div className={classes.contentWrapper}>
          {loading ? (
            <div className="Spinner_contained">
              <Spinner />
            </div>
          ) : (
            <>
              <div className={classes.status}>
                <span className={cx(classes.label, 'text-small')}>Lowest</span>
                {minPercentage > 0 && (
                  <div
                    className={cx(
                      classes.progress,
                      getClassNameByPercentage(minPercentage),
                    )}
                  >
                    <div
                      className={classes.bar}
                      style={{ width: `${minPercentage}%` }}
                    />
                    <span
                      className={cx(classes.value, 'text-small')}
                      style={{ marginLeft: `${minPercentage}%` }}
                    >
                      {minValue}
                    </span>
                  </div>
                )}
              </div>
              <div className={classes.status}>
                <span className={cx(classes.label, 'text-small')}>Average</span>
                {avgPercentage > 0 && (
                  <div
                    className={cx(
                      classes.progress,
                      getClassNameByPercentage(avgPercentage),
                    )}
                  >
                    <div
                      className={classes.bar}
                      style={{ width: `${avgPercentage}%` }}
                    />
                    <span
                      className={cx(classes.value, 'text-small')}
                      style={{ marginLeft: `${avgPercentage}%` }}
                    >
                      {avgValue}
                    </span>
                  </div>
                )}
              </div>
              <div className={classes.status}>
                <span className={cx(classes.label, 'text-small')}>Highest</span>
                {maxPercentage > 0 && (
                  <div className={classes.progress}>
                    <div className={classes.bar} />
                    <span
                      className={cx(classes.value, 'text-small')}
                      style={{ marginLeft: `${maxPercentage}%` }}
                    >
                      {maxValue}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}

Summary.propTypes = {
  isPadding: PropTypes.bool,
  activeFilter: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  avgValue: PropTypes.number,
  loading: PropTypes.bool,
};

Summary.defaultProps = {
  isPadding: false,
  activeFilter: 0,
  minValue: 0,
  maxValue: 0,
  avgValue: 0,
  loading: false,
};

export default React.memo(Summary);
