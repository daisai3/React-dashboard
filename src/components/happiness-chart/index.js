import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ScatterPlot } from '../shared/data-chart';
import Spinner from '../shared/spinner';
import timelineService from '../../services/timeline.service';
import { getStartOfTheDay } from '../../utils';

const PERCENT_RANGE = 100;

function HappinessChart({ center, width = 0, height = 0, selectedCustomerId }) {
  const [happinessTimeline, setHappinessTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startAt = getStartOfTheDay();
    timelineService
      .getHappinessTimeline(center, selectedCustomerId, startAt)
      .then(({ data: timeline }) => {
        setHappinessTimeline(timeline);
        setLoading(false);
      });
  }, [selectedCustomerId, center]);

  if (loading || !width || !height) {
    return (
      <div className="Spinner_contained">
        <Spinner />
      </div>
    );
  }

  return (
    <ScatterPlot
      valueOfX={(d) => d.timestamp}
      valueOfY={(d) => d.value}
      xAxisValues={happinessTimeline.map((d) => d.timestamp)}
      yAxisRange={[0, PERCENT_RANGE]}
      data={happinessTimeline}
      parentHeight={height}
      parentWidth={width}
    />
  );
}

HappinessChart.propTypes = {
  center: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  selectedCustomerId: PropTypes.string.isRequired,
};

export default React.memo(HappinessChart);
