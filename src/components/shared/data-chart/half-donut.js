import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { pie, arc } from 'd3-shape';
import { select } from 'd3-selection';
import Spinner from '../spinner';
import { DARK_BLUE_PASTEL, LIGHT_GRAY } from '../../../utils';

const half = 0.5;
const third = 0.33;
const anglesRange = half * Math.PI;
const negative = -1;
const colors = [DARK_BLUE_PASTEL, LIGHT_GRAY];
const translation = (x, y) => `translate(${x || 0}, ${y || 0})`;

function HalfDonut({ value, text, height, width }) {
  const node = useRef();

  useEffect(() => {
    const MAX_VALUE = 100;
    const data = [value, MAX_VALUE - value];
    const thickness = third * height;
    const radius = Math.min(width, height / half) * half;

    const pies = pie()
      .value((d) => d)
      .sort(null)
      .startAngle(negative * anglesRange)
      .endAngle(anglesRange);

    const arcSvg = arc()
      .outerRadius(radius)
      .innerRadius(radius - thickness);

    const path = select(node.current)
      .selectAll('path')
      .data(pies(data))
      .enter()
      .append('path')
      .attr('fill', (d, i) => colors[i])
      .attr('d', arcSvg);

    const txt = select(node.current)
      .append('text')
      .text(() => value.toFixed(0))
      .attr('dy', '0')
      .attr('class', 'label')
      .attr('text-anchor', 'middle');

    return () => {
      path.remove();
      txt.remove();
    };
  }, [width, height, value, text]);

  if (!height || !width) {
    return (
      <div className="Spinner_contained">
        <Spinner />
      </div>
    );
  }

  return (
    <svg width={width} height={height}>
      <g ref={node} transform={translation(half * width, height)} />
    </svg>
  );
}

HalfDonut.propTypes = {
  value: PropTypes.number,
  text: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
};

export default HalfDonut;
