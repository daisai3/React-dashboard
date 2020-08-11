import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import EmptyLabel from '../../shared/empty-label';
import Spinner from '../../shared/spinner';
import { getClassNameByPercentage, TOTAL_PERCENTAGE } from '../../../utils';
import classes from './overall-summary.module.scss';

function OverallSummary({ journeySummary, maxUsage, loading }) {
  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>
            <FormattedMessage id="home_dashboard__journey_overall_summary" />
          </span>
        </div>
        {loading ? (
          <div className="Spinner_contained">
            <Spinner />
          </div>
        ) : (
          <div className={classes.contentWrapper}>
            {journeySummary.length === 0 && <EmptyLabel />}
            {journeySummary.map((row) => {
              const percentage = (row.value * TOTAL_PERCENTAGE) / maxUsage;
              return (
                <div className={classes.status} key={row.id}>
                  <span
                    className={cx(classes.label, 'text-normal', 'text-right')}
                  >
                    {/* <FormattedMessage id="home_dashboard__journey_overall_summary_assistance" /> */}
                    {row.area}
                  </span>
                  <div
                    className={cx(
                      classes.progress,
                      getClassNameByPercentage(percentage),
                    )}
                  >
                    <div
                      className={classes.bar}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                    <span
                      className={cx(classes.value, 'text-small')}
                      style={{ marginLeft: `${percentage}%` }}
                    >
                      {`${row.value}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}

OverallSummary.propTypes = {
  journeySummary: PropTypes.arrayOf(PropTypes.shape),
  maxUsage: PropTypes.number,
  loading: PropTypes.bool,
};
OverallSummary.defaultProps = {
  journeySummary: [],
  maxUsage: 100,
  loading: false,
};

export default React.memo(OverallSummary);
