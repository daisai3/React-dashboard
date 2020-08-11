import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import JourneyDetails from '../../../components/journey/journey-details';
import { Store } from '../../../store';
import classes from './relevant-indicators.module.scss';

function getAreaStatistics(centers) {
  let areas = [];
  let mainEntranceCnt = 0;
  let secondaryEntranceCnt = 0;
  let mainEntrancePercent = 0;
  let secondaryEntrancePercent = 0;

  if (centers && centers.areaStatistics) {
    const { areas: _areas, clients: total } = centers.areaStatistics;
    _areas.map((row, index) => {
      if (row.area_type === 'Entry') mainEntranceCnt = row.clients;
      if (row.area_type === 'Exit') secondaryEntranceCnt = row.clients;
      if (row.area_type !== 'Entry' && row.area_type !== 'Exit') {
        let areaPercent = 0;
        if (total > 0) {
          areaPercent = (row.clients / total) * 100;
          if (!Number.isInteger(areaPercent)) {
            areaPercent = Number(areaPercent.toFixed(1));
          }
        }
        areas = [...areas, { ...row, id: index, percent: areaPercent }];
      }
      return row;
    });
    if (total > 0) {
      mainEntrancePercent = (mainEntranceCnt / total) * 100;
      secondaryEntrancePercent = (secondaryEntranceCnt / total) * 100;
      if (!Number.isInteger(mainEntrancePercent)) {
        mainEntrancePercent = Number(mainEntrancePercent.toFixed(1));
      }
      if (!Number.isInteger(secondaryEntrancePercent)) {
        secondaryEntrancePercent = Number(secondaryEntrancePercent.toFixed(1));
      }
    }
  }

  return {
    areas,
    mainEntranceCnt,
    secondaryEntranceCnt,
    mainEntrancePercent,
    secondaryEntrancePercent,
  };
}

function RelevantIndicators() {
  const [store] = useContext(Store);
  const { global, centers } = store;
  const loading = global?.loading;
  const areaStatisticsLoading = loading?.areaStatistics;
  const {
    areas,
    mainEntranceCnt,
    secondaryEntranceCnt,
    mainEntrancePercent,
    secondaryEntrancePercent,
  } = getAreaStatistics(centers);

  return (
    <BlockWrapper title="journey_dashboard__relevant_indicators_title">
      <div className={classes.mainWrapper}>
        <JourneyDetails
          mainEntranceCnt={mainEntranceCnt}
          secondaryEntranceCnt={secondaryEntranceCnt}
          mainEntrancePercent={mainEntrancePercent}
          secondaryEntrancePercent={secondaryEntrancePercent}
          areas={areas}
          loading={areaStatisticsLoading}
        />
      </div>
    </BlockWrapper>
  );
}

RelevantIndicators.propTypes = {
  openCustomerList: PropTypes.func,
};

RelevantIndicators.defaultProps = {
  openCustomerList: () => {},
};

export default React.memo(RelevantIndicators);
