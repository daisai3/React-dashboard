import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Spinner from '../../shared/spinner';
import classes from './overall-waiting-time.module.scss';

function OverallWaitingTime({ totalPeopleWaiting, avgWaitingTime, loading }) {
  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>
            <FormattedMessage
              id="waitingTime_dashboard__content_overall"
              defaultMessage="Overall waiting time in center"
            />
          </span>
        </div>
        <div className={classes.contentWrapper}>
          <div className={classes.average}>
            <div className={classes.bar}>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner width={24} />
                </div>
              ) : (
                <span>{`${avgWaitingTime}'`}</span>
              )}
            </div>
            <div className={cx(classes.label, 'text-small', 'text-center')}>
              <FormattedMessage
                id="waitingTime_dashboard__content_overall_average"
                defaultMessage="Avg. Waiting Time"
              />
            </div>
          </div>
          <div className={classes.average}>
            <div className={classes.bar}>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner width={24} />
                </div>
              ) : (
                <span>{`${totalPeopleWaiting}`}</span>
              )}
            </div>
            <div className={cx(classes.label, 'text-small', 'text-center')}>
              <FormattedMessage
                id="waitingTime_dashboard__content_overall_total"
                defaultMessage="Total people waiting"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

OverallWaitingTime.propTypes = {
  totalWaitingTime: PropTypes.number,
  avgWaitingTime: PropTypes.number,
  loading: PropTypes.bool,
};
OverallWaitingTime.defaultProps = {
  totalWaitingTime: 0,
  avgWaitingTime: 0,
  loading: false,
};

export default React.memo(OverallWaitingTime);
