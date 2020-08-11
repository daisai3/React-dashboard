import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Icon from '../../shared/svgIcon';
import { formatTime } from '../../../utils';
import classes from './customer-journey.module.scss';
const LocalizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(LocalizedFormat);

function JourneyBlock({ data }) {
  const { icon } = data;
  const areaName = data.area_name || 'Main Entrance';
  const areaHX = data.avg_hx;
  const entranceTime = dayjs(data.epoch_second_entrance).format('LT');
  const dwellTime = formatTime(data.dwell_time, true);

  return (
    <SectionWrapper>
      <div className={cx(classes.journeyContent, 'flex')}>
        <div className={classes.journeyIconWrapper}>
          <div className={classes.journeyIcon}>
            <Icon name={icon} width={24} height={24} />
          </div>
        </div>
        <div className={classes.journeyDetails}>
          <div className={cx(classes.areaName, 'text-small')}>{areaName}</div>
          <div className={cx(classes.areaDescription, 'text-small')}>
            {`Enter in the center through the ${areaName}`}
          </div>
          <div className={cx(classes.areaInfo, 'text-smaller', 'flex')}>
            <span className={classes.areaHX}>{`Average HX: ${areaHX}`}</span>
            <span
              className={classes.areaDwellTime}
            >{`· ${entranceTime} (${dwellTime})`}</span>
          </div>
        </div>
        <div className={classes.arrows}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </SectionWrapper>
  );
}
JourneyBlock.propTypes = {
  data: PropTypes.shape(),
};

JourneyBlock.defaultProps = {
  data: {},
};

function CustomerJourney({ journeys }) {
  return (
    <div className={classes.mainContainer}>
      <div className={cx(classes.title, 'text-normal')}>
        <FormattedMessage
          id={'deatiled_customer_dashboard__customer_journey_title'}
          defaultMessage="Customer Journey"
        />
      </div>
      <div className={classes.content}>
        {journeys.map((row) => {
          return (
            <div
              className={cx(classes.blockWrapper, classes.journeyWrapper)}
              key={row.id}
            >
              <JourneyBlock data={row} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

CustomerJourney.propTypes = {
  journeys: PropTypes.arrayOf(PropTypes.shape()),
};

CustomerJourney.defaultProps = {
  journeys: [],
};

export default React.memo(CustomerJourney);
