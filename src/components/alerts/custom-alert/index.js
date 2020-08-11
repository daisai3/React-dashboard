import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Icon from '../../shared/svgIcon';
import alertsArray from './constants';
import classes from './custom-alert.module.scss';

function CustomAlert({ type, time, alertText, recommendationText }) {
  const selectedAlert = alertsArray.filter((row) => row.type === type)[0];
  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.header}>
          <div className={classes.titleWrapper}>
            <div className={cx(classes.title, 'text-normal')}>
              {selectedAlert.title}
            </div>
            <div
              className={cx(classes.time, 'text-small')}
            >{`${time} ago`}</div>
            <div className={classes.bar} data-type={selectedAlert.type} />
          </div>
          <div className={classes.icon}>
            <Icon name={selectedAlert.icon} width={24} height={24} />
          </div>
        </div>
        <div className={classes.contentWrapper}>
          <div className={cx(classes.alert, 'text-normal')}>{alertText}</div>
          <div className={classes.recommendation}>
            <div className={cx(classes.recommendationLabel, 'text-small')}>
              Recommendation
            </div>
            <div className={cx(classes.recommendationText, 'text-small')}>
              {recommendationText}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

CustomAlert.propTypes = {
  type: PropTypes.string,
  time: PropTypes.string,
  alertText: PropTypes.string,
  recommendationText: PropTypes.string,
};

CustomAlert.defaultProps = {
  type: 'Happiness Experience',
  time: '5 minutes',
  alertText:
    'The Average Happiness Level in Center is lower than minimum threshold.',
  recommendationText:
    'Pay more attention to customers in center and be ready to attend their needs.',
};

export default React.memo(CustomAlert);
