import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import PieChart from '../../shared/pie-chart';
import Spinner from '../../shared/spinner';
import Switch from '../../shared/custom-switch';
import classes from './journey-details.module.scss';

function JourneyDetails({
  mainEntranceCnt,
  secondaryEntranceCnt,
  mainEntrancePercent,
  secondaryEntrancePercent,
  areas,
  loading,
}) {
  const [viewMode, setViewMode] = useState('percentage');
  return (
    <div className={classes.mainContainer}>
      <div className={classes.options}>
        <Switch onChangeSwitch={setViewMode} />
      </div>
      <div className={classes.entranceWrapper}>
        <div className={classes.entranceInfo}>
          <div className={cx(classes.entranceTitle, 'text-small')}>
            <FormattedMessage
              id="journey_dashboard__relevant_indicators_entrance_title"
              defaultMessage="Entrance"
            />
          </div>
          <div
            className={cx(classes.entranceStatus, classes.mainEntranceStatus)}
          >
            <span className={cx(classes.label, 'text-small')}>
              <FormattedMessage
                id="journey_dashboard__relevant_indicators_entrance_main_entrance_text"
                defaultMessage="Main Entrance"
              />
            </span>
            <span className={cx(classes.value, 'text-small')}>
              {viewMode === 'percentage'
                ? `${mainEntrancePercent}%`
                : mainEntranceCnt}
            </span>
          </div>
          <div
            className={cx(
              classes.entranceStatus,
              classes.secondaryEntranceStatus,
            )}
          >
            <span className={cx(classes.label, 'text-small')}>
              <FormattedMessage
                id="journey_dashboard__relevant_indicators_entrance_secondary_entrance_text"
                defaultMessage="Secondary Entrance"
              />
            </span>
            <span className={cx(classes.value, 'text-small')}>
              {viewMode === 'percentage'
                ? `${secondaryEntrancePercent}%`
                : secondaryEntranceCnt}
            </span>
          </div>
        </div>
        <div className={classes.pieChart}>
          {loading ? (
            <div className={cx(classes.spinnerContainer, 'Spinner_contained')}>
              <Spinner />
            </div>
          ) : (
            <PieChart
              percent1={secondaryEntrancePercent}
              percent2={mainEntrancePercent}
            />
          )}
        </div>
      </div>
      <div className={classes.areas}>
        {areas.map((area) => {
          return (
            <div className={classes.area} key={area.id}>
              <div className={cx(classes.value, 'text-smaller')}>
                {loading ? (
                  <div
                    className={cx(
                      classes.spinnerContainer,
                      'Spinner_contained',
                    )}
                  >
                    <Spinner width={16} />
                  </div>
                ) : (
                  <span>
                    {viewMode === 'percentage'
                      ? `${area.percent}%`
                      : area.clients}
                  </span>
                )}
              </div>
              <div className={cx(classes.name, 'text-small', 'text-center')}>
                {`${area.area_name}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

JourneyDetails.propTypes = {
  mainEntranceCnt: PropTypes.number,
  secondaryEntranceCnt: PropTypes.number,
  mainEntrancePercent: PropTypes.number,
  secondaryEntrancePercent: PropTypes.number,
  areas: PropTypes.arrayOf(PropTypes.shape),
  loading: PropTypes.bool,
};
JourneyDetails.defaultProps = {
  mainEntranceCnt: 0,
  secondaryEntranceCnt: 0,
  mainEntrancePercent: 0,
  secondaryEntrancePercent: 0,
  areas: [],
  loading: false,
};

export default React.memo(JourneyDetails);
