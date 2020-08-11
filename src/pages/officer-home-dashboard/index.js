import React, { useState, useEffect, useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import LiveMetrics from './general-stats';

import Alerts from './alerts';
import timeLineService from '../../services/timeline.service';
import centerService from '../../services/center.service';
import {
  FETCH_HX_MS,
  getRequestData,
  isArraysSame,
  isObjectsSame,
} from '../../utils';
import { Store } from '../../store';
import {
  storeTimelineHX,
  storeTimelineAttendance,
  clearTimeline,
} from '../../store/actions/timeline';
import {
  storeCentersWaitingTime,
  storeCentersInfo,
  clearCenters,
  storeCentersZones,
} from '../../store/actions/centers';
import {
  storeActiveFilter,
  storeLoading,
  clearLoading,
} from '../../store/actions/global';
import CustomersMap from '../customer-dashboard/insights';
import classes from './home-dashboard.module.scss';

function HomeDashboard() {
  const [loading, setLoading] = useState(true);
  const [store, dispatch] = useContext(Store);
  const { user, timeline, centers, global } = store;
  const timelineRef = useRef();
  const centersRef = useRef();
  const center = user.center_name;
  const activeFilter = 0;

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

    // get data for 'Timeline HX'
    async function hxTimelineFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ hxTimeline: true }));

      const { fromTime, toTime, timeInterval } = getRequestData(
        activeFilter,
        global,
      );
      const body = {
        center,
        history_type: 'happiness',
        from_time: fromTime,
        to_time: toTime,
        time_interval: timeInterval,
      };

      const { data: newTimelineHx } = await timeLineService.getTimelineHistory(
        body,
      );
      if (isInitial) dispatch(storeLoading({ hxTimeline: false }));

      const oldTimeLineHx =
        timelineRef.current && timelineRef.current.hx
          ? timelineRef.current.hx
          : [];
      if (!isArraysSame(oldTimeLineHx, newTimelineHx)) {
        dispatch(storeTimelineHX(newTimelineHx));
      }
    }

    // get data for 'Centers Waiting Time'
    async function centersWaitingTimeFectch({ live, isInitial }) {
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
      if (isInitial) dispatch(storeLoading({ centersWaiting: false }));

      const oldCentersWaitingTime =
        centersRef.current && centersRef.current.waitingTime
          ? centersRef.current.waitingTime
          : [];
      if (!isObjectsSame(oldCentersWaitingTime, newCentersWaitingTime)) {
        dispatch(storeCentersWaitingTime(newCentersWaitingTime));
      }
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
      if (isInitial) dispatch(storeLoading({ centersInfo: false }));

      const oldCentersInfo =
        centersRef.current && centersRef.current.centerInfo
          ? centersRef.current.centerInfo
          : [];
      if (!isObjectsSame(oldCentersInfo, newCentersInfo, false)) {
        dispatch(storeCentersInfo(newCentersInfo));
      }
    }

    // get data for zones
    async function centersZonesFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ centersZones: true }));

      const { data: newCenterZones } = await centerService.getZones(center);
      if (isInitial) dispatch(storeLoading({ centersZones: false }));

      const oldCenterZones =
        centersRef.current && centersRef.current.zones
          ? centersRef.current.zones
          : [];
      if (!isArraysSame(oldCenterZones, newCenterZones)) {
        dispatch(storeCentersZones(newCenterZones));
      }
    }

    // get data for 'Timeline Attendance'
    async function timelineAttendanceFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ timelineAttendance: true }));

      const { fromTime, toTime } = getRequestData(activeFilter, global);
      const {
        data: newTimelineAttendance,
      } = await timeLineService.getTimelineAttendance(center, fromTime, toTime);
      if (isInitial) dispatch(storeLoading({ timelineAttendance: false }));

      const oldTimelineAttendance =
        timelineRef.current && timelineRef.current.attendance
          ? timelineRef.current.attendance
          : [];
      if (!isObjectsSame(oldTimelineAttendance, newTimelineAttendance)) {
        dispatch(storeTimelineAttendance(newTimelineAttendance));
      }
    }

    hxTimelineFetch({ isInitial: true });
    centersWaitingTimeFectch({ live: activeFilter === 0, isInitial: true });
    centersInfoFetch({ isInitial: true });
    timelineAttendanceFetch({ isInitial: true });
    centersZonesFetch({ isInitial: true });

    let refetchInterval = null;
    if (activeFilter === 0) {
      refetchInterval = setInterval(() => {
        hxTimelineFetch({ isInitial: false });
        centersWaitingTimeFectch({ live: true, isInitial: false });
        centersInfoFetch({ isInitial: false });
        timelineAttendanceFetch({ isInitial: false });
        centersZonesFetch({ isInitial: false });
      }, FETCH_HX_MS);
    }

    return () => {
      clearInterval(refetchInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loading, center, activeFilter]);

  return (
    <div className={classes.mainContainer} data-testid="home-manager-page">
      <div className="pg-title">
        <FormattedMessage
          id="officer_home_dashboard__title"
          values={{ center }}
        />
      </div>
      <div className={classes.content}>
        <div className={classes.blocksWrapper}>
          <div className={classes.blockWrapper}>
            <LiveMetrics />
          </div>
          <div className={classes.blockWrapper}>
            <CustomersMap onlyMap onlyLive />
          </div>
        </div>
        <div className={classes.alertsWrapper}>
          <Alerts />
        </div>
      </div>
    </div>
  );
}

export default HomeDashboard;
