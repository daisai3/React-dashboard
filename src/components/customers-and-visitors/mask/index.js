import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Spinner from '../../shared/spinner';
import Icon from '../../shared/svgIcon';
import classes from './mask.module.scss';

function Mask({ masksPercent, loading }) {
  return (
    <div className={cx(classes.mainContainer)}>
      <SectionWrapper>
        <div className={classes.contentWrapper}>
          <div className={classes.status}>
            <div className={classes.icon}>
              <Icon name="mask" />
            </div>
            <div className={cx(classes.value, 'text-smaller', 'text-center')}>
              {loading ? (
                <div
                  className={cx(classes.spinnerContainer, 'Spinner_contained')}
                >
                  <Spinner width={16} />
                </div>
              ) : (
                <span>{`${masksPercent}%`}</span>
              )}
            </div>
          </div>
          <div className={cx(classes.label, 'text-small')}>
            People wearing masks
          </div>
          <div className={cx(classes.description, 'text-small')}>
            {`The ${masksPercent}% of customer and visitors are wearing masks in the center`}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

Mask.propTypes = {
  masksPercent: PropTypes.number,
  loading: PropTypes.bool,
};

Mask.defaultProps = {
  masksPercent: 0,
  loading: false,
};

export default React.memo(Mask);
