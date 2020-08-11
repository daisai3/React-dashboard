import React, { useState, useEffect, useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import Filter from '../../components/shared/filter';
import WaitingTimeContent from './waiting-time-content';
import centerService from '../../services/center.service';
import timeLineService from '../../services/timeline.service';
import { FETCH_HX_MS, getRequestData, isObjectsSame } from '../../utils';
import { Store } from '../../store';
import {
  storeTimelineDwellHeatmap,
  clearTimeline,
} from '../../store/actions/timeline';
import {
  storeCentersWaitingTime,
  storeCentersInfo,
  storeCentersDwellStatistics,
  storePeopleWaitingDemographics,
  clearCenters,
} from '../../store/actions/centers';
import {
  storeActiveFilter,
  storeLoading,
  clearLoading,
} from '../../store/actions/global';
import classes from './waiting-time-dashboard.module.scss';

function WaitingTimeDashboard() {
  const [loading, setLoading] = useState(true);
  const [store, dispatch] = useContext(Store);
  const { user, timeline, centers, global } = store;
  const activeFilter = global ? global.filter.id : 0;
  const calendarRange = global?.calendarRange;
  const timelineRef = useRef();
  const centersRef = useRef();
  const center = user.center_name;

  useEffect(() => {
    timelineRef.current = timeline;
    centersRef.current = centers;
  });

  useEffect(() => {
    dispatch(clearCenters());
    dispatch(clearTimeline());
    dispatch(clearLoading());
    dispatch(storeActiveFilter({ id: 0 }));
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (loading) return () => {};

    // get data for 'Centers Waiting Time'
    async function centersWaitingTimeFetch({ live, isInitial }) {
      if (isInitial) dispatch(storeLoading({ centersWaiting: true }));

      const { fromTime, toTime } = getRequestData(activeFilter, global);
      const body = {
        center,
        from_time: fromTime,
        to_time: toTime,
        live,
      };
      const {
        data: newCentersWaitingTime,
      } = await centerService.getCenterWaitingTime(body);

      const oldCentersWaitingTime =
        centersRef.current && centersRef.current.waitingTime
          ? centersRef.current.waitingTime
          : [];
      if (!isObjectsSame(oldCentersWaitingTime, newCentersWaitingTime)) {
        dispatch(storeCentersWaitingTime(newCentersWaitingTime));
      }
      if (isInitial) dispatch(storeLoading({ centersWaiting: false }));
    }

    // get data for 'People Waiting Demographics'
    async function centersPeopleWaitingDemographicsFetch({ live, isInitial }) {
      if (isInitial)
        dispatch(storeLoading({ peopleWaitingDemographics: true }));

      const { fromTime, toTime } = getRequestData(activeFilter, global);
      const body = {
        center,
        from_time: fromTime,
        to_time: toTime,
        live,
      };
      const {
        data: newPeopleWaitingDemographics,
      } = await centerService.getPeopleWaitingDemographics(body);

      const oldPeopleWaitingDemographics =
        centersRef.current && centersRef.current.peopleWaitingDemographics
          ? centersRef.current.peopleWaitingDemographics
          : [];
      if (
        !isObjectsSame(
          oldPeopleWaitingDemographics,
          newPeopleWaitingDemographics,
        )
      ) {
        dispatch(storePeopleWaitingDemographics(newPeopleWaitingDemographics));
      }
      if (isInitial) dispatch(storeLoading({ centersWaiting: false }));
    }

    // get data for selected center
    async function centersDwellStatisticsFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ dwellStatistics: true }));

      const { fromTime: from_time, toTime: to_time } = getRequestData(
        activeFilter,
        global,
      );
      const {
        data: { areas: newDwellStatistics },
      } = await centerService.getCenterAreaDwellStatistics({
        center,
        from_time,
        to_time,
      });

      const oldDwellStatistics =
        centersRef.current && centersRef.current.dwellStatistics
          ? centersRef.current.dwellStatistics
          : [];

      if (!isObjectsSame(oldDwellStatistics, newDwellStatistics)) {
        dispatch(storeCentersDwellStatistics(newDwellStatistics));
      }
      if (isInitial) dispatch(storeLoading({ dwellStatistics: false }));
    }

    // get data for selected center
    async function centersInfoFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ centersInfo: true }));

      const { fromTime, toTime } = getRequestData(activeFilter, global);
      const { data: newCentersInfo } = await centerService.getCenter(
        center,
        fromTime,
        toTime,
      );

      const oldCentersInfo =
        centersRef.current && centersRef.current.centerInfo
          ? centersRef.current.centerInfo
          : [];
      if (!isObjectsSame(oldCentersInfo, newCentersInfo)) {
        dispatch(storeCentersInfo(newCentersInfo));
      }
      if (isInitial) dispatch(storeLoading({ centersInfo: false }));
    }

    // get data for 'dwell heatmap'
    async function timelineDwellHeatmapFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ timelineDwellHeatmap: true }));

      const { fromTime: from_time, toTime: to_time } = getRequestData(
        activeFilter,
        global,
      );
      const {
        data: newTimelineDwellHeatmap,
      } = await timeLineService.getTimelinePositionDwellHeatmap({
        center,
        from_time,
        to_time,
      });
      const oldTimelineDwellHeatmap =
        timelineRef.current && timelineRef.current.dwellHeatmap
          ? timelineRef.current.dwellHeatmap
          : [];
      if (!isObjectsSame(oldTimelineDwellHeatmap, newTimelineDwellHeatmap)) {
        dispatch(storeTimelineDwellHeatmap(newTimelineDwellHeatmap));
      }
      if (isInitial) dispatch(storeLoading({ timelineDwellHeatmap: false }));
    }

    centersWaitingTimeFetch({ live: activeFilter === 0, isInitial: true });
    centersDwellStatisticsFetch({ isInitial: true });
    timelineDwellHeatmapFetch({ isInitial: true });
    centersInfoFetch({ isInitial: true });
    centersPeopleWaitingDemographicsFetch({
      live: activeFilter === 0,
      isInitial: true,
    });

    let refetchInterval = null;
    if (activeFilter === 0) {
      refetchInterval = setInterval(() => {
        centersWaitingTimeFetch({
          live: true,
          isInitial: false,
        });
        centersDwellStatisticsFetch({ isInitial: false });
        timelineDwellHeatmapFetch({ isInitial: false });
        centersInfoFetch({ isInitial: false });
        centersPeopleWaitingDemographicsFetch({ live: true, isInitial: false });
      }, FETCH_HX_MS);
    }

    return () => {
      clearInterval(refetchInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loading, center, activeFilter, calendarRange]);

  const setActiveFilterOption = (value) => {
    dispatch(storeActiveFilter({ id: value }));
  };

  return (
    <div className={classes.mainContainer} data-testid="home-manager-page">
      <div className="pg-title">
        <FormattedMessage
          id="waitingTime_dashboard_title"
          defaultMessage="Waiting time"
        />
      </div>
      <Filter
        activeOption={activeFilter}
        setActiveFilterOption={setActiveFilterOption}
      />
      <div className={classes.content}>
        <WaitingTimeContent />
      </div>
    </div>
  );
}

export default WaitingTimeDashboard;
