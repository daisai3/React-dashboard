import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Spinner from '../../shared/spinner';
import PieChart from '../../shared/pie-chart';
import classes from './gender.module.scss';

function Gender({ malePercent, femalePercent, loading }) {
  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>Gender</span>
        </div>
        <div className={classes.contentWrapper}>
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
          <div className={classes.statusWrapper}>
            <div className={cx(classes.status, classes.femaleStatus)}>
              <span className={cx(classes.label, 'text-normal')}>Female</span>
              <span
                className={cx(classes.value, 'text-normal')}
              >{`${femalePercent}%`}</span>
            </div>
            <div className={cx(classes.status, classes.maleStatus)}>
              <span className={cx(classes.label, 'text-normal')}>Male</span>
              <span
                className={cx(classes.value, 'text-normal')}
              >{`${malePercent}%`}</span>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

Gender.propTypes = {
  malePercent: PropTypes.number,
  femalePercent: PropTypes.number,
  loading: PropTypes.bool,
};
Gender.defaultProps = {
  malePercent: 70,
  femalePercent: 30,
  loading: false,
};

export default React.memo(Gender);
