import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Spinner from '../../shared/spinner';
import classes from './people-demographics.module.scss';
import PieChart from '../../shared/pie-chart';

const PERCENT = 100;

function PeopleDemographics({ demographics, loading }) {
  const { Male, Female, Local, Non, POD } = demographics;
  const totalGender = Male + Female || 1;
  const totalEthnicity = Local + Non || 1;
  const malePercent = Math.trunc(((Male || 0) / totalGender) * PERCENT);
  const femalePercent = Math.trunc(((Female || 0) / totalGender) * PERCENT);
  const localPercent = Math.trunc(((Local || 0) / totalEthnicity) * PERCENT);
  const foreignPercent = Math.trunc(((Non || 0) / totalEthnicity) * PERCENT);
  const PODPercent = Math.trunc(((POD || 0) / totalGender) * PERCENT);

  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>
            <FormattedMessage
              id="waitingTime_dashboard__people_waiting"
              defaultMessage="Demographics of people waiting:"
            />
          </span>
        </div>
        <div className={classes.contentWrapper}>
          <div className={classes.statusWrapper}>
            <div className={cx(classes.statusTitle, 'text-small')}>
              <FormattedMessage
                id="waitingTime_dashboard__people_waiting_by_gender"
                defaultMessage="By gender"
              />
            </div>
            <div
              className={cx(classes.status, classes.femaleStatus, 'text-small')}
            >
              <span className={cx(classes.label)}>Female</span>
              <span className={cx(classes.value)}>{`${femalePercent}%`}</span>
            </div>
            <div
              className={cx(classes.status, classes.maleStatus, 'text-small')}
            >
              <span className={cx(classes.label)}>Male</span>
              <span className={cx(classes.value)}>{`${malePercent}%`}</span>
            </div>
          </div>
          <div className={classes.graphWrapper}>
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
        </div>
        <div className={classes.bottomWrapper}>
          <div className={classes.singleWrapper}>
            <div className={classes.average}>
              <div className={cx(classes.bar, 'text-small')}>
                {loading ? (
                  <div
                    className={cx(
                      classes.spinnerContainer,
                      'Spinner_contained',
                    )}
                  >
                    <Spinner width={24} />
                  </div>
                ) : (
                  <span>{`${localPercent}%`}</span>
                )}
              </div>
              <div className={cx(classes.label, 'text-small', 'text-center')}>
                <FormattedMessage
                  id="waitingTime_dashboard__content_local_percent"
                  defaultMessage="Locals"
                />
              </div>
            </div>
          </div>
          <div className={classes.singleWrapper}>
            <div className={classes.average}>
              <div className={cx(classes.bar, 'text-small')}>
                {loading ? (
                  <div
                    className={cx(
                      classes.spinnerContainer,
                      'Spinner_contained',
                    )}
                  >
                    <Spinner width={24} />
                  </div>
                ) : (
                  <span>{`${foreignPercent}%`}</span>
                )}
              </div>
              <div className={cx(classes.label, 'text-small', 'text-center')}>
                <FormattedMessage
                  id="waitingTime_dashboard__content_foreigners"
                  defaultMessage="Foreigners"
                />
              </div>
            </div>
          </div>
          <div className={classes.singleWrapper}>
            <div className={classes.average}>
              <div className={cx(classes.bar, 'text-small')}>
                {loading ? (
                  <div
                    className={cx(
                      classes.spinnerContainer,
                      'Spinner_contained',
                    )}
                  >
                    <Spinner width={24} />
                  </div>
                ) : (
                  <span>{`${PODPercent}%`}</span>
                )}
              </div>
              <div className={cx(classes.label, 'text-small', 'text-center')}>
                <FormattedMessage
                  id="waitingTime_dashboard__content_pod_percent"
                  defaultMessage="POD"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

PeopleDemographics.propTypes = {
  demographics: PropTypes.shape({
    Female: PropTypes.number,
    Male: PropTypes.number,
    Local: PropTypes.number,
    Non: PropTypes.number,
    POD: PropTypes.number,
  }),
  loading: PropTypes.bool,
};
PeopleDemographics.defaultProps = {
  demographics: {
    Female: 0,
    Male: 0,
    Local: 0,
    Non: 0,
  },
  loading: false,
};

export default React.memo(PeopleDemographics);
