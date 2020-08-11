import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Link } from '@reach/router';
import { NORMAL_ICON_WIDTH } from '../../../../utils';
import Icon from '../../svgIcon';
import classes from './block-wrapper.module.scss';

function BlockWrapper({
  title,
  isTitleShow,
  isIndicator,
  prefix,
  isIcon,
  onOpen,
  isDetails,
  to,
  children,
}) {
  return (
    <div className={classes.block}>
      {isTitleShow && (
        <ClickAwayListener onClickAway={() => onOpen(false)}>
          <div className={classes.header}>
            <div className={classes.titleWrapper}>
              <span className={cx(classes.title, 'text-large')}>
                {isIndicator && (
                  <Icon name="singleEllipse" width={8} height={8} />
                )}
                {prefix.length > 0 && (
                  <span className={classes.titlePrefix}>{prefix}</span>
                )}
                <FormattedMessage id={title} defaultMessage="" />
              </span>
              {isIcon && (
                <button
                  type="button"
                  className={classes.info}
                  onClick={() => onOpen(true)}
                >
                  <Icon
                    name="info"
                    width={NORMAL_ICON_WIDTH}
                    height={NORMAL_ICON_WIDTH}
                  />
                </button>
              )}
            </div>
            {isDetails && (
              <div className={classes.details}>
                <Link data-testid="nav-link" to={to}>
                  See details
                </Link>
              </div>
            )}
          </div>
        </ClickAwayListener>
      )}
      {children}
    </div>
  );
}

BlockWrapper.propTypes = {
  title: PropTypes.string,
  isTitleShow: PropTypes.bool,
  prefix: PropTypes.string,
  isIndicator: PropTypes.bool,
  isIcon: PropTypes.bool,
  isDetails: PropTypes.bool,
  to: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onOpen: PropTypes.func,
};

BlockWrapper.defaultProps = {
  title: '',
  isTitleShow: true,
  prefix: '',
  isIndicator: false,
  isIcon: false,
  isDetails: false,
  to: '',
  onOpen: () => {},
};

export default React.memo(BlockWrapper);
