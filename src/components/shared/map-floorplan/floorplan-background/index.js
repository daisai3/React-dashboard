import React from 'react';
import PropTypes from 'prop-types';

function FloorPlanBackground({ src, height }) {
  return (
    <img
      src={src}
      alt="floor plan"
      style={{
        height,
      }}
    />
  );
}

FloorPlanBackground.propTypes = {
  src: PropTypes.string,
  height: PropTypes.number,
};

FloorPlanBackground.defaultProps = {
  src: '',
  height: 248,
};

export default React.memo(FloorPlanBackground);
