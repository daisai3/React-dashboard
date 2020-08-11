import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import OverallWaitingTime from '../../../components/waiting-time/overall';
import PeopleByArea from '../../../components/waiting-time/people-by-area';
import WaitingTimeMap from '../../../components/waiting-time/waiting-time-map';
import WaitingTimeHeatmap from '../../../components/waiting-time/waiting-time-heatmap';
import PeopleDemographics from '../../../components/waiting-time/people-demographics';
import { Store } from '../../../store';
import { FIXED_CNT, FILTER_LIVE_ID } from '../../../utils';
import classes from './waiting-time-content.module.scss';

function getWaitingTimeData(centers) {
  let totalWaitingTime = 0;
  let avgWaitingTime = 0;
  let waitingAreaAttendance = [];
  let totalCnt = 0;
  let maxPeopleCnt = 0;
  let peopleDemographics = {};
  if (centers && centers.waitingTime) {
    const { waitingTime } = centers;
    totalWaitingTime = waitingTime.total_waiting_time;
    waitingAreaAttendance = waitingTime.waiting_areas_attendance.map(
      (row, index) => {
        if (row.amount > maxPeopleCnt) maxPeopleCnt = row.amount;
        return {
          ...row,
          id: index,
        };
      },
    );
    totalCnt = waitingTime.total_ppl_waiting;
    if (totalCnt > 0) {
      avgWaitingTime = Math.floor(totalWaitingTime / totalCnt);
      if (!Number.isInteger(avgWaitingTime)) {
        avgWaitingTime = Number(avgWaitingTime.toFixed(FIXED_CNT));
      }
    }
  }

  if (centers && centers.waitingTime) {
    peopleDemographics = centers.peopleWaitingDemographics;
  }

  return {
    totalWaitingTime,
    avgWaitingTime,
    waitingAreaAttendance,
    totalCnt,
    maxPeopleCnt,
    peopleDemographics,
  };
}

function getActiveFilter(global) {
  return global ? global.filter.id : 0;
}

function getFloorPlanInfo(centers) {
  const floorPlanInfo = {
    img: '',
    pxPerMeter: 0,
  };
  if (centers && centers.centerInfo) {
    const {
      centerInfo: { floor_plan, floor_plan_px_per_meter },
    } = centers;
    floorPlanInfo.img = floor_plan;
    floorPlanInfo.pxPerMeter = floor_plan_px_per_meter;
  }
  return floorPlanInfo;
}

function getHeatmapTimeline(timeline) {
  const heatmapData = {};
  if (timeline && timeline.dwellHeatmap) {
    const { dwellHeatmap } = timeline;
    return dwellHeatmap;
  }
  return heatmapData;
}

function getZones(centers) {
  let zoneList = [];
  if (centers && centers.dwellStatistics) {
    const { dwellStatistics } = centers;
    zoneList = dwellStatistics.map((row, index) => {
      const { area_type, polygon } = row;
      return {
        ...row,
        id: index,
        area_type: area_type?.toLowerCase(),
        polygon: JSON.parse(polygon),
      };
    });
  }
  return zoneList;
}

function getZonesWithAttendance({ zones, waAttendances }) {
  return zones.map((zone) => {
    const _zone = zone;
    waAttendances.map((waAttendance) => {
      if (zone.area_name === waAttendance.area)
        _zone.people = waAttendance.amount;
      return waAttendance;
    });
    if (!_zone.people) _zone.people = 0;
    return _zone;
  });
}

function WaitingTimeContent() {
  const [store] = useContext(Store);
  const { global, centers, timeline } = store;
  const activeFilter = getActiveFilter(global);
  const heatmapData = getHeatmapTimeline(timeline);
  const floorPlanInfo = getFloorPlanInfo(centers);
  const zones = getZones(centers);
  const {
    totalWaitingTime,
    avgWaitingTime,
    waitingAreaAttendance,
    totalCnt,
    maxPeopleCnt,
    peopleDemographics,
  } = getWaitingTimeData(centers);
  const loading = global?.loading;
  const centersWaitingLoading = loading?.centersWaiting;
  const centersInfoLoading = loading?.centersInfo;
  const centersDwellStatisticsLoading = loading?.dwellStatistics;
  const timelineDwellHeatmapLoading = loading?.timelineDwellHeatmap;

  const zonesWithAttendance = getZonesWithAttendance({
    zones,
    waAttendances: waitingAreaAttendance,
  });

  return (
    <BlockWrapper
      title="waitingTime_dashboard__content_title"
      isIndicator={activeFilter === 0}
      prefix={activeFilter === 0 ? 'Live' : ''}
    >
      <div className={classes.mainWrapper}>
        <div className={classes.left}>
          <div className={classes.overallWaitingTimeWrapper}>
            <OverallWaitingTime
              totalPeopleWaiting={totalCnt}
              avgWaitingTime={avgWaitingTime}
              loading={centersWaitingLoading}
            />
          </div>
          <div className={classes.peopleByAreaWrapper}>
            <PeopleByArea
              waitingAreaAttendance={waitingAreaAttendance}
              loading={centersWaitingLoading}
              maxPeopleCnt={maxPeopleCnt}
            />
          </div>
          <div className={classes.peopleDemographicsWrapper}>
            <PeopleDemographics
              demographics={peopleDemographics}
              loading={centersWaitingLoading}
            />
          </div>
        </div>
        <div className={classes.right}>
          {activeFilter === FILTER_LIVE_ID && (
            <WaitingTimeMap
              floorPlanInfo={floorPlanInfo}
              zones={zonesWithAttendance}
              loading={centersInfoLoading || centersDwellStatisticsLoading}
            />
          )}
          {activeFilter > FILTER_LIVE_ID && (
            <WaitingTimeHeatmap
              heatmapData={heatmapData}
              floorPlanInfo={floorPlanInfo}
              zones={zonesWithAttendance}
              loading={
                centersInfoLoading ||
                centersDwellStatisticsLoading ||
                timelineDwellHeatmapLoading
              }
            />
          )}
        </div>
      </div>
    </BlockWrapper>
  );
}

WaitingTimeContent.propTypes = {};

WaitingTimeContent.defaultProps = {};

export default React.memo(WaitingTimeContent);
