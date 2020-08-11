import React, { useState, useEffect, useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import Filter from '../../components/shared/filter';
import Happiness from './hx';
import WaitingTime from './waiting-time';
import CustomersAndVisitors from './customers-and-visitors';
import JourneySummary from './journey';
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
  storeCentersJourney,
  clearCenters,
} from '../../store/actions/centers';
import {
  storeActiveFilter,
  storeLoading,
  clearLoading,
} from '../../store/actions/global';
import classes from './home-dashboard.module.scss';

function HomeDashboard() {
  const [loading, setLoading] = useState(true);
  const [store, dispatch] = useContext(Store);
  const { user, timeline, centers, global } = store;
  const timelineRef = useRef();
  const centersRef = useRef();
  const center = user.center_name;
  const activeFilter = global && global.filter ? global.filter.id : 0;
  const calendarRange = global?.calendarRange;

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

      const oldTimeLineHx =
        timelineRef.current && timelineRef.current.hx
          ? timelineRef.current.hx
          : [];
      if (!isArraysSame(oldTimeLineHx, newTimelineHx)) {
        dispatch(storeTimelineHX(newTimelineHx));
      }
      if (isInitial) dispatch(storeLoading({ hxTimeline: false }));
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

      const oldCentersWaitingTime =
        centersRef.current && centersRef.current.waitingTime
          ? centersRef.current.waitingTime
          : [];
      if (!isObjectsSame(oldCentersWaitingTime, newCentersWaitingTime)) {
        dispatch(storeCentersWaitingTime(newCentersWaitingTime));
      }
      if (isInitial) dispatch(storeLoading({ centersWaiting: false }));
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

    // get data for 'Timeline Journey'
    async function timelineJourneyFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ timelineJourney: true }));

      const { fromTime, toTime } = getRequestData(activeFilter, global);
      const body = {
        center,
        from_time: fromTime,
        to_time: toTime,
      };
      const {
        data: newCentersJourney,
      } = await timeLineService.getTimelineJourney(body);

      const oldCentersJourney =
        centersRef.current && centersRef.current.journey
          ? centersRef.current.journey
          : [];
      if (!isObjectsSame(oldCentersJourney, newCentersJourney)) {
        dispatch(storeCentersJourney(newCentersJourney));
      }
      if (isInitial) dispatch(storeLoading({ timelineJourney: false }));
    }

    // get data for 'Timeline Attendance'
    async function timelineAttendanceFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ timelineAttendance: true }));

      const { fromTime, toTime } = getRequestData(activeFilter, global);
      const {
        data: newTimelineAttendance,
      } = await timeLineService.getTimelineAttendance(center, fromTime, toTime);

      const oldTimelineAttendance =
        timelineRef.current && timelineRef.current.attendance
          ? timelineRef.current.attendance
          : [];
      if (!isObjectsSame(oldTimelineAttendance, newTimelineAttendance)) {
        dispatch(storeTimelineAttendance(newTimelineAttendance));
      }
      if (isInitial) dispatch(storeLoading({ timelineAttendance: false }));
    }

    hxTimelineFetch({ isInitial: true });
    centersWaitingTimeFectch({ live: activeFilter === 0, isInitial: true });
    centersInfoFetch({ isInitial: true });
    timelineJourneyFetch({ isInitial: true });
    timelineAttendanceFetch({ isInitial: true });

    let refetchInterval = null;
    if (activeFilter === 0) {
      refetchInterval = setInterval(() => {
        hxTimelineFetch({ isInitial: false });
        centersWaitingTimeFectch({ live: true, isInitial: false });
        centersInfoFetch({ isInitial: false });
        timelineJourneyFetch({ isInitial: false });
        timelineAttendanceFetch({ isInitial: false });
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
          id="home_dashboard__title"
          defaultMessage=""
          values={{ center }}
        />
      </div>
      <Filter
        activeOption={activeFilter}
        setActiveFilterOption={setActiveFilterOption}
      />
      <div className={classes.content}>
        <div className={classes.blocksWrapper}>
          <div className={classes.blockWrapper}>
            <Happiness activeFilter={activeFilter} />
          </div>
          <div className={classes.blockWrapper}>
            <WaitingTime />
          </div>
          <div className={classes.blockWrapper}>
            <CustomersAndVisitors />
          </div>
          <div className={classes.blockWrapper}>
            <JourneySummary />
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
