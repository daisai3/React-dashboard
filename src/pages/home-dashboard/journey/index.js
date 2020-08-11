import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import _ from 'lodash';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import LineChart from '../../../components/journey/line-chart';
import OverallSummary from '../../../components/journey/overall-summary';
import { Store } from '../../../store';
import { TOTAL_PERCENTAGE, FIXED_CNT } from '../../../utils';
import classes from './journey.module.scss';

function getLabels({ centers }) {
  let labels = [];
  let values = [];

  if (centers && centers.journey) {
    const {
      journey: { areas_journey },
    } = centers;
    values = areas_journey.map(({ value }) => {
      return Number.isInteger(value) ? value : Number(value.toFixed(FIXED_CNT));
    });
    labels = ['Entry', '', 'Journey', '', 'Exit'];
    // labels = areas_journey.map(({ area_type }) => area_type);
  }

  return { chartLabels: labels, chartValues: values };
}

function getSummary({ centers }) {
  let journeySummary = [];
  let maxUsage = TOTAL_PERCENTAGE;
  if (centers && centers.journey) {
    const {
      journey: { area_usage },
    } = centers;
    maxUsage = _.maxBy(area_usage.map((row) => row.value)) * TOTAL_PERCENTAGE;
    journeySummary = area_usage.map((row, index) => {
      const _row = { ...row };
      _row.id = index;
      _row.value *= TOTAL_PERCENTAGE;
      if (!Number.isInteger(_row.value))
        _row.value = _row.value.toFixed(FIXED_CNT);
      return _row;
    });
  }

  return {
    journeySummary,
    maxUsage,
  };
}

function JourneyBlock() {
  const [store] = useContext(Store);
  const { centers, global } = store;
  const { chartLabels, chartValues } = getLabels({ centers });
  const { journeySummary, maxUsage } = getSummary({ centers });
  const loading = global?.loading;
  const timelineJourneyLoading = loading?.timelineJourney;

  return (
    <BlockWrapper title="journey_summary" isDetails to="journey">
      <div className={classes.graphWrapper}>
        <LineChart
          labels={chartLabels}
          values={chartValues}
          loading={timelineJourneyLoading}
        />
      </div>
      <div className={classes.summaryWrapper}>
        <OverallSummary
          journeySummary={journeySummary}
          maxUsage={maxUsage}
          loading={timelineJourneyLoading}
        />
      </div>
    </BlockWrapper>
  );
}
JourneyBlock.propTypes = {};
export default React.memo(JourneyBlock);
