import React from 'react';
import PropTypes from 'prop-types';
import types from './types';

const Icon = React.memo(function Icon({ name, className, ...args }) {
  let iconData = types[name];
  if (!iconData) {
    iconData = types.example;
  }
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconData.viewBox}
    >
      <path fill="currentColor" d={iconData.d} {...args} />
    </svg>
  );
});

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Icon;
