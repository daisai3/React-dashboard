import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import PieChart from '../../shared/pie-chart';
import Spinner from '../../shared/spinner';
import classes from './customer-details.module.scss';

const ONE_MINUTE = 60;
function CustomerDetails({
  femalePercent,
  malePercent,
  customerCnt,
  podsCnt,
  localsPercent,
  foreignPercent,
  avgWaitingTime,
  loading,
}) {
  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>
            <FormattedMessage
              id="customer_dashboard__insight_details_title"
              defaultMessage="Customer details:"
            />
          </span>
        </div>
        <div className={classes.content}>
          <div className={cx(classes.status, classes.totalStatus)}>
            <div className={cx(classes.value, 'text-smaller')}>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner width={16} />
                </div>
              ) : (
                <span>{customerCnt}</span>
              )}
            </div>
            <div className={cx(classes.label, 'text-small', 'text-center')}>
              Total
            </div>
          </div>
          <div className={classes.genderWrapper}>
            <div className={classes.pieChart}>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner />
                </div>
              ) : (
                <PieChart percent1={malePercent} percent2={femalePercent} />
              )}
            </div>
            <div className={classes.genderInfo}>
              <div className={cx(classes.genderTitle, 'text-small')}>
                Gender
              </div>
              <div className={cx(classes.genderStatus, classes.femaleStatus)}>
                <span className={cx(classes.label, 'text-small')}>Female</span>
                <span
                  className={cx(classes.value, 'text-small')}
                >{`${femalePercent}%`}</span>
              </div>
              <div className={cx(classes.genderStatus, classes.maleStatus)}>
                <span className={cx(classes.label, 'text-small')}>Male</span>
                <span
                  className={cx(classes.value, 'text-small')}
                >{`${malePercent}%`}</span>
              </div>
            </div>
          </div>
          <div className={classes.status}>
            <div className={cx(classes.value, 'text-smaller')}>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner width={16} />
                </div>
              ) : (
                <span>{`${(avgWaitingTime / ONE_MINUTE).toFixed(0)}'`}</span>
              )}
            </div>
            <div className={cx(classes.label, 'text-small', 'text-center')}>
              Avg Waiting Time
            </div>
          </div>
          <div className={classes.status}>
            <div className={cx(classes.value, 'text-smaller')}>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner width={16} />
                </div>
              ) : (
                <span>{podsCnt}</span>
              )}
            </div>
            <div className={cx(classes.label, 'text-small', 'text-center')}>
              POD
            </div>
          </div>
          <div className={classes.status}>
            <div className={cx(classes.value, 'text-smaller')}>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner width={16} />
                </div>
              ) : (
                <span>{`${localsPercent}%`}</span>
              )}
            </div>
            <div className={cx(classes.label, 'text-small', 'text-center')}>
              Locals
            </div>
          </div>
          <div className={classes.status}>
            <div className={cx(classes.value, 'text-smaller')}>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner width={16} />
                </div>
              ) : (
                <span>{`${foreignPercent}%`}</span>
              )}
            </div>
            <div className={cx(classes.label, 'text-small', 'text-center')}>
              Foreigners
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

CustomerDetails.propTypes = {
  femalePercent: PropTypes.number,
  malePercent: PropTypes.number,
  customerCnt: PropTypes.number,
  podsCnt: PropTypes.number,
  localsPercent: PropTypes.number,
  foreignPercent: PropTypes.number,
  avgWaitingTime: PropTypes.number,
  loading: PropTypes.bool,
};
CustomerDetails.defaultProps = {
  femalePercent: 30,
  malePercent: 70,
  customerCnt: 70,
  podsCnt: 70,
  localsPercent: 100,
  foreignPercent: 0,
  avgWaitingTime: 0,
  loading: false,
};

export default React.memo(CustomerDetails);
