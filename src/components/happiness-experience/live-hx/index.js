import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ProgressBar from 'react-customizable-progressbar';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Spinner from '../../shared/spinner';
import {
  BAD_CRITERIA,
  MEDIUM_CRITERIA,
  GOOD_CRITERIA,
  TRAFFIC_RED,
  TRAFFIC_YELLOW,
  TRAFFIC_GREEN,
} from '../../../utils';
import classes from './live-hx.module.scss';

function getDonutColor(value) {
  let color = '';
  if (value > BAD_CRITERIA) color = TRAFFIC_RED;
  if (value > MEDIUM_CRITERIA) color = TRAFFIC_YELLOW;
  if (value > GOOD_CRITERIA) color = TRAFFIC_GREEN;
  return color;
}

function LiveHX({ isPadding, value, loading }) {
  if (loading) {
    return (
      <div
        className={cx(classes.mainContainer, isPadding ? 'grid-column' : '')}
      >
        <SectionWrapper>
          <div className="Spinner_contained">
            <Spinner />
          </div>
        </SectionWrapper>
      </div>
    );
  }
  return (
    <div className={cx(classes.mainContainer, isPadding ? 'grid-column' : '')}>
      <SectionWrapper>
        <ProgressBar
          className={classes.halfDonut}
          progress={value}
          radius={100}
          cut={180}
          rotate={-180}
          strokeWidth={20}
          strokeColor={getDonutColor(value)}
          trackStrokeWidth={20}
          trackStrokeColor="#F6F6F6"
          initialAnimation
          trackTransition="0s ease"
          pointerRadius={0}
        >
          <div className={classes.status}>
            <div className={classes.percentage}>{value}</div>
            <div className={classes.label}>
              <span className={cx(classes.text, 'text-small')}>HX</span>
            </div>
          </div>
        </ProgressBar>
      </SectionWrapper>
    </div>
  );
}

LiveHX.propTypes = {
  isPadding: PropTypes.bool,
  value: PropTypes.number,
  loading: PropTypes.bool,
};

LiveHX.defaultProps = {
  isPadding: false,
  value: 0,
  loading: false,
};

export default React.memo(LiveHX);
