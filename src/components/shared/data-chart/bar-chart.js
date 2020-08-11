import React from 'react';
import PropTypes from 'prop-types';
import { scaleBand, scaleLinear } from 'd3-scale';
import Axis from './utils/axis';
import Bars from './utils/bars';
import Spinner from '../spinner';

const margins = { top: 10, right: 10, bottom: 20, left: 10 };

function BarChart({ width, height, data, name }) {
  const maxValue = Math.max(...Object.values(data));

  const INNER_PADDING = 0.3;
  const xScale = scaleBand()
    .domain(Object.keys(data))
    .range([margins.left, width - margins.right])
    .paddingInner(INNER_PADDING);

  const yScale = scaleLinear()
    .domain([0, maxValue])
    .range([height, margins.top]);

  if (!width) {
    return (
      <div className="Spinner_contained">
        <Spinner />
      </div>
    );
  }

  return (
    <svg width={width} height={height}>
      <g className="axis-group">
        <Axis
          noLine
          nameSelector={name}
          scale={xScale}
          orient="bottom"
          transform={`translate(0, ${height - margins.bottom || 0})`}
        />
        <Bars
          xScale={xScale}
          yScale={yScale}
          margins={margins}
          data={data}
          height={height}
        />
      </g>
    </svg>
  );
}

BarChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  name: PropTypes.string,
};

export default BarChart;
