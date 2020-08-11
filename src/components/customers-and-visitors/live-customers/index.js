import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Spinner from '../../shared/spinner';
import classes from './live-customers.module.scss';

function LiveCustomers({
  customerCnt,
  localsCnt,
  podsCnt,
  loading,
  onlyTotal,
}) {
  return (
    <div className={cx(classes.mainContainer)}>
      <SectionWrapper>
        <div className={classes.contentWrapper}>
          <div className={classes.live}>
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
              Customers
            </div>
          </div>
          {!onlyTotal && (
            <>
              <div className={classes.live}>
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
                    <span>{localsCnt}</span>
                  )}
                </div>
                <div className={cx(classes.label, 'text-small', 'text-center')}>
                  Locals
                </div>
              </div>
              <div className={classes.live}>
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
                    <span>{podsCnt}</span>
                  )}
                </div>
                <div className={cx(classes.label, 'text-small', 'text-center')}>
                  POD
                </div>
              </div>
            </>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}

LiveCustomers.propTypes = {
  customerCnt: PropTypes.number,
  localsCnt: PropTypes.number,
  podsCnt: PropTypes.number,
  loading: PropTypes.bool,
  onlyTotal: PropTypes.bool,
};

LiveCustomers.defaultProps = {
  customerCnt: 0,
  localsCnt: 0,
  podsCnt: 0,
  loading: false,
  onlyTotal: false,
};

export default React.memo(LiveCustomers);
