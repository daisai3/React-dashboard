import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import classes from './switch.module.scss';
import Icon from '../svgIcon';

function Switch({ onChangeSwitch }) {
  const [status, setStatus] = useState('percentage');

  const onClickOption = (value) => {
    if (value !== status) {
      setStatus(value);
      onChangeSwitch(value);
    }
  };

  return (
    <div className={classes.switchWrapper}>
      <button
        type="button"
        className={cx(
          classes.option,
          status === 'percentage' ? classes.activeOption : '',
        )}
        onClick={() => onClickOption('percentage')}
      >
        <Icon name="percentage" width={12} />
      </button>
      <div className={classes.divider}></div>
      <button
        type="button"
        className={cx(
          classes.option,
          status === 'number' ? classes.activeOption : '',
        )}
        onClick={() => onClickOption('number')}
      >
        <Icon name="numbers2" width={12} />
      </button>
    </div>
  );
}

Switch.propTypes = {
  onChangeSwitch: PropTypes.func,
};

Switch.defaultProps = {
  onChangeSwitch: () => {},
};

export default React.memo(Switch);
