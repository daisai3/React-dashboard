import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';

const TICKS = 5;

function Axis({ scale, orient, transform, width, nameSelector, noLine }) {
  const node = useRef();

  function renderAxis() {
    let axis;
    let grid;
    let appendedAxis;
    if (orient === 'bottom') {
      axis = axisBottom(scale);
    }
    if (orient === 'left') {
      axis = axisLeft(scale).ticks(TICKS);
      grid = axisLeft(scale)
        .tickSize(-width)
        .tickFormat('')
        .ticks(TICKS);
    }
    if (grid) {
      select(node.current)
        .attr('class', 'y axis-grid')
        .call(grid);
    }
    if (axis) {
      appendedAxis = select(node.current)
        .append('g')
        .attr('class', `${nameSelector || ''} ${noLine ? 'bar-tags' : 'axis'}`)
        .call(axis)
        .call((g) => g.select('.domain').remove())
        .call((g) => g.selectAll('line').remove());
    }

    return () => {
      appendedAxis.remove();
    };
  }

  useEffect(renderAxis, [scale]);

  return <g ref={node} transform={transform} className={`${orient} axis`} />;
}

Axis.propTypes = {
  scale: PropTypes.func.isRequired,
  orient: PropTypes.oneOf(['bottom', 'left']).isRequired,
  width: PropTypes.number,
  transform: PropTypes.string,
  nameSelector: PropTypes.string,
  noLine: PropTypes.bool,
};

export default Axis;
