import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Icon from '../../shared/svgIcon';
import { FIXED_CNT } from '../../../utils';
import classes from './customer-journey.module.scss';

const info = 'Wait some time in the Happiness Area';

function ProgressBlock({ data, isLast }) {
  return (
    <SectionWrapper>
      <div className={classes.icon}>
        <Icon name={data.icon} width={24} height={24} />
        {/* <Icon name="entrance" width={24} height={24} /> */}
      </div>
      <div className={cx(classes.name, 'text-small')}>{data.name}</div>
      <div className={cx(classes.info, 'text-small')}>{info}</div>
      <div className={cx(classes.arrows, isLast ? classes.lastArrow : '')}>
        {!isLast ? (
          <>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </>
        ) : (
          <Icon name="max" size={24} />
        )}
      </div>
    </SectionWrapper>
  );
}
ProgressBlock.propTypes = {
  data: PropTypes.string,
  isLast: PropTypes.bool,
};

ProgressBlock.defaultProps = {
  data: '',
  isLast: false,
};

function FinalBlock({ data }) {
  return (
    <SectionWrapper>
      <div className={cx(classes.description, 'text-normal')}>
        {`This journey has been done by ${data.toFixed(
          FIXED_CNT,
        )}% of people in the center`}
      </div>
    </SectionWrapper>
  );
}
FinalBlock.propTypes = {
  data: PropTypes.number,
};

FinalBlock.defaultProps = {
  data: 0,
};

function CustomerJourney({ title, data, border }) {
  const { percent, journey } = data;

  return (
    <div className={classes.mainContainer}>
      <SectionWrapper border={border}>
        <div className={classes.title}>
          <span className={cx([`${border}-text`], 'text-small')}>{title}</span>
        </div>
        <div className={classes.content}>
          {journey.map((row, index) => {
            return (
              <div
                className={cx(
                  classes.blockWrapper,
                  classes.progressBlockWrapper,
                )}
                key={row.id}
              >
                <ProgressBlock
                  data={row}
                  isLast={index === journey.length - 1}
                />
              </div>
            );
          })}
          <div className={cx(classes.blockWrapper, classes.finalBlock)}>
            <FinalBlock data={percent} />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

CustomerJourney.propTypes = {
  title: PropTypes.string,
  data: PropTypes.shape({
    id: PropTypes.number,
    journey: PropTypes.array,
    percent: PropTypes.number,
  }),
  border: PropTypes.string,
};

CustomerJourney.defaultProps = {
  title: '',
  data: { id: 0, journey: [], percent: 0 },
  border: '',
};

export default React.memo(CustomerJourney);
