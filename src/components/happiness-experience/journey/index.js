import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Icon from '../../shared/svgIcon';
import { FIXED_CNT } from '../../../utils';
import classes from './journey.module.scss';

function ProgressBlock({ data }) {
  return (
    <SectionWrapper>
      <div className={classes.icon}>
        <Icon name={data.icon} width={24} height={24} />
      </div>
      <div className={cx(classes.name, 'text-small')}>{data.name}</div>
      <div className={classes.arrows}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </SectionWrapper>
  );
}
ProgressBlock.propTypes = {
  data: PropTypes.string,
};

ProgressBlock.defaultProps = {
  data: '',
};

function FinalBlock({ data }) {
  return (
    <SectionWrapper>
      <div
        className={cx(classes.description, 'text-normal')}
      >{`This journey has been done by ${data.toFixed(
        FIXED_CNT,
      )}% of people in the center`}</div>
    </SectionWrapper>
  );
}
FinalBlock.propTypes = {
  data: PropTypes.number,
};

FinalBlock.defaultProps = {
  data: 0,
};

function Journey({ title, data }) {
  const { percent, journey } = data;

  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.title}>
          <span className="text-small">{title}</span>
        </div>
        <div className={classes.content}>
          {journey.map((row) => {
            return (
              <div
                className={cx(classes.blockWrapper, classes.progressWrapper)}
                key={row.id}
              >
                <ProgressBlock data={row} />
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

Journey.propTypes = {
  title: PropTypes.string,
  data: PropTypes.shape({
    id: PropTypes.number,
    journey: PropTypes.array,
    percent: PropTypes.number,
  }),
};

Journey.defaultProps = {
  title: '',
  data: { id: 0, journey: [], percent: 0 },
};

export default React.memo(Journey);
