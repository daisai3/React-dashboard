import React from 'react';
import PropTypes from 'prop-types';
import classes from './spinner.module.scss';
import Icon from '../svgIcon';

function Spinner({ width }) {
  return (
    <div data-testid="spinner" className={classes.spinner}>
      <Icon name="spinner" width={width} />
    </div>
  );
}
Spinner.propTypes = {
  width: PropTypes.number,
};
Spinner.defaultProps = {
  width: 40,
};
export default Spinner;
