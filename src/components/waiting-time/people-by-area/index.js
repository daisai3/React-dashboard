import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import EmptyLabel from '../../shared/empty-label';
import Spinner from '../../shared/spinner';
import { getClassNameByPercentage, TOTAL_PERCENTAGE } from '../../../utils';
import classes from './people-by-area.module.scss';

function PeopleByArea({ waitingAreaAttendance, maxPeopleCnt, loading }) {
  // loading = true;
  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>
            <FormattedMessage
              id="waitingTime_dashboard__content_peopleByArea"
              defaultMessage="People waiting by area"
            />
          </span>
        </div>
        {loading ? (
          <div className={cx(classes.spinnerContainer, 'Spinner_contained')}>
            <Spinner />
          </div>
        ) : (
          <div className={classes.contentWrapper}>
            {waitingAreaAttendance.length === 0 && <EmptyLabel />}
            {waitingAreaAttendance.map((row) => {
              const percentage = (row.amount * TOTAL_PERCENTAGE) / maxPeopleCnt;
              return (
                <div className={classes.status} key={row.id}>
                  <span
                    className={cx(classes.label, 'text-normal', 'text-right')}
                  >
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
        )}
      </SectionWrapper>
    </div>
  );
}

PeopleByArea.propTypes = {
  waitingAreaAttendance: PropTypes.arrayOf(PropTypes.shape),
  maxPeopleCnt: PropTypes.number,
  loading: PropTypes.bool,
};
PeopleByArea.defaultProps = {
  waitingAreaAttendance: [],
  maxPeopleCnt: 100,
  loading: false,
};

export default React.memo(PeopleByArea);
