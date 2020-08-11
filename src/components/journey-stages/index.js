import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Stage from './stage';
import Spinner from '../shared/spinner';
import timelineService from '../../services/timeline.service';
import { getStartOfTheDay } from '../../utils';

function JourneyStages({ center, selectedCustomerId }) {
  const [stageMap, setStageMap] = useState(0);
  const [numOfStages, setNumOfStages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startAt = getStartOfTheDay();
    timelineService
      .getStagesTimeline(center, selectedCustomerId, startAt)
      .then(({ data: timeline }) => {
        setNumOfStages(timeline.length);
        const newStageMap = {};
        timeline.forEach((frame, i) => {
          let indexesMap;
          if (newStageMap[frame.type]) {
            if (newStageMap[frame.type][frame.value]) {
              indexesMap = newStageMap[frame.type][frame.value];
            } else {
              newStageMap[frame.type][frame.value] = {};
              indexesMap = newStageMap[frame.type][frame.value];
            }
          } else {
            newStageMap[frame.type] = {};
            indexesMap = {};
          }
          indexesMap[i] = true;
          newStageMap[frame.type][frame.value] = indexesMap;
        });
        setStageMap(newStageMap);
        setLoading(false);
      });
  }, [selectedCustomerId, center]);

  if (loading) {
    return (
      <div className="Spinner_contained ">
        <Spinner />
      </div>
    );
  }

  return Object.keys(stageMap).map((category) => {
    return (
      <Stage
        key={category}
        name={category}
        stages={numOfStages}
        indexesToFill={stageMap[category]}
      />
    );
  });
}

JourneyStages.propTypes = {
  selectedCustomerId: PropTypes.string.isRequired,
};

export default React.memo(JourneyStages);
