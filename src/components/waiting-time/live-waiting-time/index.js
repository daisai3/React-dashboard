import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Spinner from '../../shared/spinner';
import { getClassNameByPercentage, TOTAL_PERCENTAGE } from '../../../utils';
import classes from './live-waiting-time.module.scss';

function LiveWaitingTime({
  activeFilter,
  totalWaitingTime,
  waitingAreaAttendance,
  totalCnt,
  loading,
  onlyTotal,
}) {
  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.contentWrapper}>
          <div className={classes.live}>
            <div className={classes.bar}>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner width={24} />
                </div>
              ) : (
                <span>{`${totalWaitingTime}'`}</span>
              )}
            </div>
            <div className={cx(classes.label, 'text-small', 'text-center')}>
              Wait time
            </div>
          </div>
          {!onlyTotal && (
            <>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner />
                </div>
              ) : (
                <div className={classes.statusContainer}>
                  <div className={classes.scrollableWrapper}>
                    {waitingAreaAttendance.map((row) => {
                      const percentage =
                        (row.amount * TOTAL_PERCENTAGE) / totalCnt;
                      return (
                        <div className={classes.status} key={row.id}>
                          <span className={cx(classes.label, 'text-normal')}>
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
                              {`${row.amount} people`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {activeFilter === 0 && (
                    <div className={classes.status}>
                      <span
                        className={cx(
                          classes.label,
                          classes.boldLabel,
                          'text-normal',
                        )}
                      >
                        Total people waiting
                      </span>
                      <div className={classes.progress}>
                        <div className={classes.bar} />
                        <span className={cx(classes.value, 'text-small')}>
                          {`${totalCnt} people`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}

LiveWaitingTime.propTypes = {
  activeFilter: PropTypes.number,
  totalWaitingTime: PropTypes.number,
  waitingAreaAttendance: PropTypes.arrayOf(PropTypes.shape),
  totalCnt: PropTypes.number,
  loading: PropTypes.bool,
  onlyTotal: PropTypes.bool,
};
LiveWaitingTime.defaultProps = {
  activeFilter: 0,
  totalWaitingTime: 0,
  waitingAreaAttendance: [],
  totalCnt: 0,
  loading: false,
  onlyTotal: false,
};

export default React.memo(LiveWaitingTime);
