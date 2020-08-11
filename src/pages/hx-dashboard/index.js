import React, { useEffect, useContext, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import Filter from '../../components/shared/filter';
import OverallSummary from './overall-summary';
import CommonJourney from './common-journey';
import HXArea from './hx-area';
import timeLineService from '../../services/timeline.service';
import centerService from '../../services/center.service';
import {
  FETCH_HX_MS,
  getRequestData,
  isArraysSame,
  isObjectsSame,
} from '../../utils';
import { Store } from '../../store';
import { storeTimelineHX, clearTimeline } from '../../store/actions/timeline';
import {
  storeCentersCommonJourneys,
  storeCentersHappinessArea,
  storeCentersInfo,
  storeCentersZones,
  clearCenters,
} from '../../store/actions/centers';
import {
  storeActiveFilter,
  storeLoading,
  clearLoading,
} from '../../store/actions/global';
import classes from './hx-dashboard.module.scss';

function HappinessExperienceDashboard() {
  const [loading, setLoading] = useState(true);
  const [store, dispatch] = useContext(Store);
  const { user, timeline, centers, global } = store;
  const timelineRef = useRef();
  const centersRef = useRef();
  const center = user.center_name;
  const activeFilter = global ? global.filter.id : 0;
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

    // get data for 'More common Journeys of our Customers'
    async function centersCommonJourneyFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ commonJourney: true }));

      const { fromTime, toTime } = getRequestData(activeFilter, global);
      const body = {
        center,
        from_time: fromTime,
        to_time: toTime,
      };

      const {
        data: newCentersCommonJourney,
      } = await timeLineService.getMostTraveledJourneys(body);

      const oldCentersCommonJourney =
        centersRef.current && centersRef.current.commonJourneys
          ? centersRef.current.commonJourneys
          : [];
      if (!isArraysSame(oldCentersCommonJourney, newCentersCommonJourney)) {
        dispatch(storeCentersCommonJourneys(newCentersCommonJourney));
      }
      if (isInitial) dispatch(storeLoading({ commonJourney: false }));
    }

    // get data for 'Happiness Experience by area'
    async function centersHxAreaFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ centersHxArea: true }));

      const { fromTime, toTime } = getRequestData(activeFilter, global);
      const body = {
        center,
        from_time: fromTime,
        to_time: toTime,
      };

      const {
        data: newCentersHappinessArea,
      } = await centerService.getCenterHappinessArea(body);

      const oldCentersHappinessArea =
        centersRef.current && centersRef.current.happinessArea
          ? centersRef.current.happinessArea
          : [];
      if (!isArraysSame(oldCentersHappinessArea, newCentersHappinessArea)) {
        dispatch(storeCentersHappinessArea(newCentersHappinessArea));
      }
      if (isInitial) dispatch(storeLoading({ centersHxArea: false }));
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

    // get data for zones
    async function centersZonesFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ centersZones: true }));

      const { data: newCenterZones } = await centerService.getZones(center);
      const oldCenterZones =
        centersRef.current && centersRef.current.zones
          ? centersRef.current.zones
          : [];

      if (!isArraysSame(oldCenterZones, newCenterZones)) {
        dispatch(storeCentersZones(newCenterZones));
      }
      if (isInitial) dispatch(storeLoading({ centersZones: false }));
    }

    hxTimelineFetch({ isInitial: true });
    centersCommonJourneyFetch({ isInitial: true });
    centersHxAreaFetch({ isInitial: true });
    centersInfoFetch({ isInitial: true });
    centersZonesFetch({ isInitial: true });

    let refetchInterval = null;
    if (activeFilter === 0) {
      refetchInterval = setInterval(() => {
        hxTimelineFetch({ isInitial: false });
        centersCommonJourneyFetch({ isInitial: false });
        centersHxAreaFetch({ isInitial: false });
        centersInfoFetch({ isInitial: false });
        centersZonesFetch({ isInitial: false });
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
        <FormattedMessage id="hx_dashboard_title" defaultMessage="" />
      </div>
      <Filter
        activeOption={activeFilter}
        setActiveFilterOption={setActiveFilterOption}
      />
      <div className={classes.content}>
        <div className={classes.overallSummary}>
          <OverallSummary />
        </div>
        <div className={classes.bottom}>
          <div className={cx(classes.commonJourney, 'grid-column')}>
            <CommonJourney />
          </div>
          <div className={cx(classes.hxArea, 'grid-column')}>
            <HXArea />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HappinessExperienceDashboard;
