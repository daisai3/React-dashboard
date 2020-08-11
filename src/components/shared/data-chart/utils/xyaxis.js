import React from 'react';
import PropTypes from 'prop-types';
import Axis from './axis';

const XYAxis = ({ yScale, /* xScale, height, */ width }) => {
  // Will need in a future
  // const xSettings = {
  //   scale: xScale,
  //   orient: 'bottom',
  //   transform: `translate(0, ${height})`,
  // };
  const ySettings = {
    scale: yScale,
    orient: 'left',
    width,
  };
  return (
    <g className="axis-group">
      {/* <Axis {...xSettings} /> */}
      <Axis {...ySettings} />
    </g>
  );
};

XYAxis.propTypes = {
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default XYAxis;
