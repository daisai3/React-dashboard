import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';
import classes from './button.module.scss';
import { scss } from '../../../utils';
import Spinner from '../spinner';

function Button({
  onClick,
  children,
  type = 'info',
  async = false,
  icon = false,
  className = '',
}) {
  const [loading, setLoading] = useState(false);

  function onClickWrapper() {
    if (async) {
      setLoading(true);
      onClick().then(() => {
        setLoading(false);
      });
    }
    onClick();
  }
  return (
    <button
      data-testid="button"
      className={scss(
        className,
        classes.button,
        classes[type],
        icon ? classes.long : '',
      )}
      onClick={onClickWrapper}
      type="button"
    >
      {!loading ? children : <Spinner />}
      {icon && <Icon name="chevron-down" />}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  type: PropTypes.oneOf(['primary', 'success', 'alert', 'info']),
  async: PropTypes.bool,
  icon: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
