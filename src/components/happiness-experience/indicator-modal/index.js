import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import Icon from '../../shared/svgIcon';
import { NORMAL_ICON_WIDTH } from '../../../utils';
import classes from './info-modal.module.scss';

const ticks = { good: '100', medium: '80', bad: '40', zero: '0' };
function IndicatorModal({ onClose }) {
  return (
    <div className={classes.mainContainer}>
      <div className={classes.actionWrapper}>
        <button type="button" onClick={() => onClose(false)}>
          <Icon
            name="close"
            width={NORMAL_ICON_WIDTH}
            height={NORMAL_ICON_WIDTH}
          />
        </button>
      </div>
      <div className={classes.contentWrapper}>
        <div className={classes.indicator}>
          <div className={cx(classes.indicatorTitle, 'text-normal')}>
            <FormattedMessage id="home_dashboard__hx_indicator_title" />
          </div>
          <div className={cx(classes.indicatorDesc, 'text-normal')}>
            <FormattedMessage id="home_dashboard__hx_indicator_description" />
          </div>
        </div>
        <div className={classes.colorsWrapper}>
          <div className={classes.colorWrapper}>
            <div className={cx(classes.tick, 'text-small')}>{ticks.good}</div>
            <div className={cx(classes.color, classes.goodColor, 'text-small')}>
              <span>
                <FormattedMessage id="home_dashboard__hx_indicator_good" />
              </span>
            </div>
          </div>
          <div className={classes.colorWrapper}>
            <div className={cx(classes.tick, 'text-small')}>{ticks.medium}</div>
            <div
              className={cx(classes.color, classes.mediumColor, 'text-small')}
            >
              <span>
                <FormattedMessage id="home_dashboard__hx_indicator_medium" />
              </span>
            </div>
          </div>
          <div className={classes.colorWrapper}>
            <div className={cx(classes.tick, 'text-small')}>{ticks.bad}</div>
            <div className={cx(classes.tick, classes.zeroTick, 'text-small')}>
              {ticks.zero}
            </div>
            <div className={cx(classes.color, classes.badColor, 'text-small')}>
              <span>
                <FormattedMessage id="home_dashboard__hx_indicator_bad" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

IndicatorModal.propTypes = {
  onClose: PropTypes.func,
};
IndicatorModal.defaultProps = {
  onClose: () => {},
};
export default React.memo(IndicatorModal);
