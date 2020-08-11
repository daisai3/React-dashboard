import React, { useState, useEffect, useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import Filter from '../../components/shared/filter';
import RelevantIndicators from './relevant-indicators';
import TopJourneys from './top-journeys';
import centerService from '../../services/center.service';
import timeLineService from '../../services/timeline.service';
import {
  FETCH_HX_MS,
  getRequestData,
  isArraysSame,
  isObjectsSame,
} from '../../utils';
import { Store } from '../../store';
import { clearTimeline } from '../../store/actions/timeline';
import {
  storeCentersAreaStatistics,
  storeCentersCommonJourneys,
  clearCenters,
} from '../../store/actions/centers';
import {
  storeActiveFilter,
  storeLoading,
  clearLoading,
} from '../../store/actions/global';
import classes from './customer-dashboard.module.scss';

function JourneyDashboard() {
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

    // get data for 'area statistics'
    async function centersAreaStatisticsFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ areaStatistics: true }));

      const { fromTime, toTime } = getRequestData(activeFilter, global);
      const body = {
        center,
        from_time: fromTime,
        to_time: toTime,
        is_live: true,
      };

      const {
        data: newCentersAreaStatistics,
      } = await centerService.getCenterAreaStatistics(body);

      const oldCentersAreaStatistics =
        centersRef.current && centersRef.current.areaStatistics
          ? centersRef.current.areaStatistics
          : [];
      if (!isObjectsSame(oldCentersAreaStatistics, newCentersAreaStatistics)) {
        dispatch(storeCentersAreaStatistics(newCentersAreaStatistics));
      }
      if (isInitial) dispatch(storeLoading({ areaStatistics: false }));
    }
    centersAreaStatisticsFetch({ isInitial: true });
    centersCommonJourneyFetch({ isInitial: true });

    let refetchInterval = null;
    if (activeFilter === 0) {
      refetchInterval = setInterval(() => {
        centersAreaStatisticsFetch({ isInitial: false });
        centersCommonJourneyFetch({ isInitial: false });
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
          id="journey_dashboard_title"
          defaultMessage="Customer & Visitor Journey"
        />
      </div>
      <Filter
        activeOption={activeFilter}
        setActiveFilterOption={setActiveFilterOption}
      />
      <div className={classes.content}>
        <div className={classes.relevantIndicatorsWrapper}>
          <RelevantIndicators />
        </div>
        <div className={classes.topJourneysWrapper}>
          <TopJourneys />
        </div>
      </div>
    </div>
  );
}

export default JourneyDashboard;
