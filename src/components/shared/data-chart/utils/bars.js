import React from 'react';
import PropTypes from 'prop-types';
import { DARK_BLUE_PASTEL } from '../../../../utils';

const X_HALF_POSITION = 2;
const Y_UP_BY_TWO = 2;

const HEX = 16;
const THIRD_OF_BYTE = 85;

function opacityToHex(index) {
  const full_op = 255;
  const reducedPortion = index * THIRD_OF_BYTE;
  const final_op = full_op - reducedPortion;
  return final_op.toString(HEX);
}
function Bars({ xScale, yScale, margins, data, height }) {
  return Object.keys(data).map((key, i) => (
    <g key={key}>
      <rect
        key={key}
        x={xScale(key)}
        y={yScale(data[key])}
        width={xScale.bandwidth()}
        height={
          data[key] !== 0 ? height - margins.bottom - yScale(data[key]) : 0
        }
        fill={`${DARK_BLUE_PASTEL}${opacityToHex(i)}`}
      />
      <text
        x={xScale(key) + xScale.bandwidth() / X_HALF_POSITION}
        y={
          data[key] !== 0
            ? yScale(data[key]) - Y_UP_BY_TWO
            : height - margins.bottom
        }
        textAnchor="middle"
        alignmentBaseline="baseline"
        fill="grey"
        fontSize="12"
      >
        {data[key]}
      </text>
    </g>
  ));
}

Bars.propTypes = {
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  margins: PropTypes.objectOf(PropTypes.number),
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  height: PropTypes.number,
  maxValue: PropTypes.number,
};

export default Bars;
