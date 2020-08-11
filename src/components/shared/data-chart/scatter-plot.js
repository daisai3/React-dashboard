import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear, scaleBand } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import Line from './utils/line';
import XYAxis from './utils/xyaxis';

const paddingTicks = 0.1;

const margins = {
  top: 10,
  right: 20,
  bottom: 20,
  left: 30,
};

function ScatterPlot({
  xAxisValues,
  yAxisRange,
  data,
  parentWidth,
  parentHeight,
  valueOfX = (d) => d,
  valueOfY = (d) => d,
}) {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newWidth = parentWidth - margins.left - margins.right;
    const newHeight = parentHeight - margins.top - margins.bottom;
    setHeight(newHeight || 0);
    setWidth(newWidth || 0);
    setLoading(false);
  }, [parentWidth, parentHeight]);

  const xScale = scaleBand()
    .domain(xAxisValues)
    .rangeRound([0, width])
    .padding(paddingTicks);

  const yScale = scaleLinear()
    .domain(yAxisRange)
    .range([height, 0])
    .nice();

  const lineGenerator = line()
    .x((d) => xScale(valueOfX(d)))
    .y((d) => yScale(valueOfY(d)))
    .curve(curveMonotoneX);

  if (loading || !height || !width) {
    return null;
  }

  return (
    <svg
      className="lineChartSvg"
      width={width + margins.left + margins.right}
      height={height + margins.top + margins.bottom}
    >
      <g transform={`translate(${margins.left}, ${margins.top})`}>
        <XYAxis xScale={xScale} yScale={yScale} height={height} width={width} />
        <Line
          valueOfX={valueOfX}
          valueOfY={valueOfY}
          data={data}
          xScale={xScale}
          yScale={yScale}
          lineGenerator={lineGenerator}
          width={width}
          height={height}
        />
      </g>
    </svg>
  );
}

ScatterPlot.propTypes = {
  xAxisValues: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ).isRequired,
  yAxisRange: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  parentWidth: PropTypes.number.isRequired,
  parentHeight: PropTypes.number.isRequired,
  valueOfX: PropTypes.func.isRequired,
  valueOfY: PropTypes.func.isRequired,
};

export default ScatterPlot;
