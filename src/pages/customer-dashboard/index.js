import React, { useState, useEffect, useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import Filter from '../../components/shared/filter';
import Insights from './insights';
import CustomerList from './customer-list';
import centerService from '../../services/center.service';
import timeLineService from '../../services/timeline.service';
import {
  FETCH_HX_MS,
  getRequestData,
  isArraysSame,
  isObjectsSame,
  FILTER_LIVE_ID,
} from '../../utils';
import { Store } from '../../store';
import {
  storeTimelineHeatmap,
  storeTimelineAttendance,
  clearTimeline,
} from '../../store/actions/timeline';
import {
  storeCentersAreaStatistics,
  storeCentersInfo,
  storeCentersZones,
  storeCentersCustomers,
  clearCenters,
} from '../../store/actions/centers';
import {
  storeActiveFilter,
  storeLoading,
  clearLoading,
} from '../../store/actions/global';
import classes from './customer-dashboard.module.scss';

const CUSTOMERS_PER_PAGE = 20;

function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [customerListCurrentPage, setCustomerListCurrentPage] = useState(0);
  const [customerListTotalPage, setCustomerListTotalPage] = useState(-2);
  const [store, dispatch] = useContext(Store);
  const [customerListOpened, setCustomerListOpened] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
      if (!isObjectsSame(oldCentersInfo, newCentersInfo, false)) {
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

    // get data for 'Customers'
    async function centersCustomersFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ centersCustomers: true }));

      const { fromTime: from_time, toTime: to_time } = getRequestData(
        activeFilter,
        global,
      );
      const {
        data: newCentersCustomers,
      } = await centerService.getCenterCustomers({
        center,
        from_time,
        to_time,
        live: activeFilter === FILTER_LIVE_ID,
        page: customerListCurrentPage,
        page_size: CUSTOMERS_PER_PAGE,
      });

      const { total_pages: totalPages } = newCentersCustomers;
      setCustomerListTotalPage(totalPages);

      const oldCentersCustomers =
        centersRef.current && centersRef.current.customers
          ? centersRef.current.customers
          : {};
      if (!isObjectsSame(oldCentersCustomers, newCentersCustomers)) {
        dispatch(storeCentersCustomers(newCentersCustomers));
      }
      if (isInitial) dispatch(storeLoading({ centersCustomers: false }));
    }

    // get data for 'heatmap'
    async function timelineHeatmapFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ timelineHeatmap: true }));

      const { fromTime, toTime } = getRequestData(activeFilter, global);
      const {
        data: newTimelineHeatmap,
      } = await timeLineService.getTimelineHeatmap(center, fromTime, toTime);
      if (isInitial) dispatch(storeLoading({ timelineHeatmap: false }));

      const oldTimelineHeatmap =
        timelineRef.current && timelineRef.current.heatmap
          ? timelineRef.current.heatmap
          : [];
      if (!isObjectsSame(oldTimelineHeatmap, newTimelineHeatmap)) {
        dispatch(storeTimelineHeatmap(newTimelineHeatmap));
      }
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

    centersAreaStatisticsFetch({ isInitial: true });
    centersInfoFetch({ isInitial: true });
    centersZonesFetch({ isInitial: true });
    centersCustomersFetch({ isInitial: true });
    timelineHeatmapFetch({ isInitial: true });
    timelineAttendanceFetch({ isInitial: true });

    let refetchInterval = null;
    if (activeFilter === 0) {
      refetchInterval = setInterval(() => {
        centersAreaStatisticsFetch({ isInitial: false });
        centersInfoFetch({ isInitial: false });
        centersZonesFetch({ isInitial: false });
        // centersCustomersFetch({ isInitial: false });
        timelineHeatmapFetch({ isInitial: false });
        timelineAttendanceFetch({ isInitial: false });
      }, FETCH_HX_MS);
    }

    return () => {
      clearInterval(refetchInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    loading,
    center,
    activeFilter,
    calendarRange,
    selectedCustomer,
  ]);

  useEffect(() => {
    // get data for 'Customers'
    async function centersCustomersFetch() {
      const { fromTime: from_time, toTime: to_time } = getRequestData(
        activeFilter,
        global,
      );
      const {
        data: newCentersCustomers,
      } = await centerService.getCenterCustomers({
        center,
        from_time,
        to_time,
        live: activeFilter === FILTER_LIVE_ID,
        page: customerListCurrentPage,
        page_size: CUSTOMERS_PER_PAGE,
      });

      const { total_pages: totalPages } = newCentersCustomers;
      setCustomerListTotalPage(totalPages);

      const oldCentersCustomers =
        centersRef.current && centersRef.current.customers
          ? centersRef.current.customers
          : [];

      const _oldCustomers = oldCentersCustomers.customers || [];
      const { customers: _newCustomers } = newCentersCustomers;
      newCentersCustomers.customers = _oldCustomers.concat(_newCustomers);

      if (customerListCurrentPage !== 0) {
        setTimeout(() => {
          dispatch(storeCentersCustomers(newCentersCustomers));
        }, 2000);
      }
    }

    centersCustomersFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerListCurrentPage]);

  const setActiveFilterOption = (value) => {
    setCustomerListCurrentPage(0);
    dispatch(storeActiveFilter({ id: value }));
  };

  const toggleCustomerList = () => {
    setCustomerListOpened(!customerListOpened);
  };

  const onFilterBack = (isFilterMinimized) => {
    if (!isFilterMinimized) setSelectedCustomer(null);
    toggleCustomerList();
  };

  const setDetailedCustomer = (data, detailedPageShowed) => {
    setSelectedCustomer(data);
    if (!detailedPageShowed) {
      toggleCustomerList();
    }
  };

  const onFetchNewCustomers = () => {
    setCustomerListCurrentPage(customerListCurrentPage + 1);
  };

  return (
    <div className={classes.mainContainer} data-testid="home-manager-page">
      <div className="pg-title">
        <FormattedMessage
          id={
            selectedCustomer
              ? 'deatiled_customer_dashboard_title'
              : 'customer_dashboard_title'
          }
          defaultMessage="Customers"
        />
      </div>
      <Filter
        activeOption={activeFilter}
        setActiveFilterOption={setActiveFilterOption}
        isGoback={customerListOpened || !!selectedCustomer}
        isMinimized={!customerListOpened && !!selectedCustomer}
        isTodayTab={customerListOpened}
        onBack={
          customerListOpened || !!selectedCustomer ? onFilterBack : () => {}
        }
      />
      <div className={classes.content}>
        {!customerListOpened && (
          <div className={classes.insightWrapper}>
            <Insights
              openCustomerList={toggleCustomerList}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={setDetailedCustomer}
            />
          </div>
        )}
        {customerListOpened && (
          <div className={classes.customerListWrapper}>
            <CustomerList
              currentPage={customerListCurrentPage}
              totalPage={customerListTotalPage}
              onSelectCustomer={setDetailedCustomer}
              onFetchNewCustomers={onFetchNewCustomers}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
