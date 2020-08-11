import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { TRANSITION_DURATION } from '../../../../utils';

function Line({ valueOfX, valueOfY, xScale, yScale, data, lineGenerator }) {
  const node = useRef();

  useEffect(() => {
    const lineWidth = 2;
    const line = select(node.current)
      .append('path')
      .datum(data)
      .attr('id', 'line')
      .attr('data-testid', 'chart-line')
      .attr('class', 'stroke')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', lineWidth)
      .attr('fill', 'none')
      .attr('d', lineGenerator);

    const t = transition().duration(TRANSITION_DURATION);
    if (process.env.NODE_ENV !== 'test') {
      // SVG functions are not supported in jets...
      // removing this condition will throw the tests with an undefined for getTotalLength
      const totalLength = line._groups[0][0].getTotalLength();
      select(line._groups[0][0])
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition(t)
        .attr('stroke-dashoffset', 0);
    }

    const circleRadius = 5;
    const circles = select(node.current)
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('data-testid', 'chart-circle')
      .attr('class', 'circle')
      .attr('fill', 'currentColor')
      .attr('r', circleRadius)
      .attr('cx', (d) => xScale(valueOfX(d)))
      .attr('opacity', 0)
      .attr('cy', (d) => yScale(valueOfY(d)));

    circles
      .transition(t)
      .attr('opacity', 1)
      .attr('cx', (d) => xScale(valueOfX(d)))
      .attr('cy', (d) => yScale(valueOfY(d)));

    return () => {
      circles.remove();
      line.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xScale, yScale, data, lineGenerator]);

  return <g className="line-group" data-testid="hx-chart" ref={node} />;
}

Line.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  valueOfX: PropTypes.func.isRequired,
  valueOfY: PropTypes.func.isRequired,
  lineGenerator: PropTypes.func.isRequired,
};

export default Line;
