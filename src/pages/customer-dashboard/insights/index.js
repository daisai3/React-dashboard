import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import CustomerDetails from '../../../components/customers-and-visitors/customer-details';
import HxArea from '../../../components/customers-and-visitors/hx-area';
import CustomerList from '../../../components/customers-and-visitors/customer-list';
import CustomerDetail from '../../../components/customers-and-visitors/customer-detail';
import CustomerJourney from '../../../components/customers-and-visitors/customer-journey';
import CustomerMap from '../../../components/customers-and-visitors/customer-map';
import CustomerHeatmap from '../../../components/customers-and-visitors/customer-heatmap';
import { Store } from '../../../store';
import centerService from '../../../services/center.service';
import {
  TOTAL_PERCENTAGE,
  FIXED_CNT,
  FILTER_LIVE_ID,
  getRequestData,
} from '../../../utils';
import classes from './insights.module.scss';
import config from '../../../config';
import timelineService from '../../../services/timeline.service';

function getLiveCustomerStatics(centers) {
  const podsCnt = 0;
  let customerCnt = 0;
  let localsPercent = 0;
  let foreignPercent = 0;
  let femalePercent = 0;
  let malePercent = 0;
  let avgWaitingTime = 0;

  if (centers && centers.centerInfo) {
    const {
      centerInfo,
      centerInfo: { customer_list },
    } = centers;
    customerCnt = customer_list.length;

    const femaleCnt = customer_list.filter((row) => row.gender === 'Female')
      .length;
    const localsCnt = customer_list.filter((row) => row.ethnicity === 'Local')
      .length;
    if (customerCnt > 0) {
      femalePercent = (femaleCnt * TOTAL_PERCENTAGE) / customerCnt;
      malePercent = TOTAL_PERCENTAGE - femalePercent;
      localsPercent = (localsCnt * TOTAL_PERCENTAGE) / customerCnt;
      foreignPercent = TOTAL_PERCENTAGE - localsPercent;

      if (!Number.isInteger(femalePercent)) {
        femalePercent = Number(femalePercent.toFixed(FIXED_CNT));
        malePercent = Number(malePercent.toFixed(FIXED_CNT));
      }
      if (!Number.isInteger(localsPercent)) {
        localsPercent = Number(localsPercent.toFixed(FIXED_CNT));
      }

      if (!Number.isInteger(foreignPercent)) {
        foreignPercent = Number(foreignPercent.toFixed(FIXED_CNT));
      }
    }
    avgWaitingTime = centerInfo.avg_waiting_time;
  }

  return {
    customerCnt,
    podsCnt,
    localsPercent,
    foreignPercent,
    femalePercent,
    malePercent,
    avgWaitingTime,
  };
}

function getPastCustomerStatics(timeline) {
  const podsCnt = 0;
  let customerCnt = 0;
  let localsPercent = 0;
  let foreignPercent = 0;
  let femalePercent = 0;
  let malePercent = 0;
  const avgWaitingTime = 0;

  if (timeline && timeline.attendance) {
    const { attendance } = timeline;
    customerCnt = attendance.total_customers;
    const femaleCnt = attendance.Female;
    const localsCnt = attendance.Local;

    if (customerCnt > 0) {
      femalePercent = (femaleCnt * TOTAL_PERCENTAGE) / customerCnt;
      malePercent = TOTAL_PERCENTAGE - femalePercent;
      localsPercent = (localsCnt * TOTAL_PERCENTAGE) / customerCnt;
      foreignPercent = TOTAL_PERCENTAGE - localsPercent;

      if (!Number.isInteger(femalePercent)) {
        femalePercent = Number(femalePercent.toFixed(FIXED_CNT));
        malePercent = Number(malePercent.toFixed(FIXED_CNT));
      }
      if (!Number.isInteger(localsPercent)) {
        localsPercent = Number(localsPercent.toFixed(FIXED_CNT));
      }

      if (!Number.isInteger(foreignPercent)) {
        foreignPercent = Number(foreignPercent.toFixed(FIXED_CNT));
      }
    }
  }
  return {
    customerCnt,
    podsCnt,
    localsPercent,
    foreignPercent,
    femalePercent,
    malePercent,
    avgWaitingTime,
  };
}

function getActiveFilter(global) {
  return global ? global.filter.id : 0;
}

function getCustomers(centers) {
  const customerList = [];
  if (centers && centers.centerInfo) {
    const {
      centerInfo: { customer_list },
    } = centers;
    return customer_list;
  }
  return customerList;
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
  const heatmapData = {
    max: 0,
    values: [],
  };
  if (timeline && timeline.heatmap) {
    const { heatmap: _heatmap } = timeline;
    return _heatmap;
  }
  return heatmapData;
}

function getZones(centers) {
  let zoneList = [];
  if (centers && centers.zones) {
    const { zones } = centers;
    zoneList = zones.map((row, index) => {
      const { area_type } = row;
      return { ...row, id: index, area_type: area_type?.toLowerCase() };
    });
  }
  return zoneList;
}

function getAreaStatistics(centers) {
  if (centers && centers.areaStatistics) {
    const { areaStatistics } = centers;
    areaStatistics.areas = areaStatistics.areas.map((row, index) => ({
      ...row,
      id: index,
    }));

    return areaStatistics;
  }
  return [];
}

function Insights({
  openCustomerList,
  selectedCustomer,
  onlyMap,
  onlyLive,
  onSelectCustomer,
}) {
  const [activeBtnId, setActiveBtnId] = useState(-1);
  const [selectedCustomerJourneys, setSelectedCustomerJourneys] = useState([]);
  const [selectedCustomerHeatmap, setSelectedCustomerHeatmap] = useState(null);
  const [store] = useContext(Store);
  const { user, global, centers, timeline } = store;
  const activeFilter = getActiveFilter(global);
  const center = user.center_name;

  useEffect(() => {
    // get data for 'Customers'
    async function centersCustomerJourneyFetch({ center_name, customer }) {
      if (!customer) {
        setSelectedCustomerJourneys([]);
        return;
      }

      const { global_identity } = customer;
      const { data } = await centerService.getCenterCustomerJourney({
        center_name,
        global_identity,
      });
      setSelectedCustomerJourneys(
        data.map((row, index) => {
          const icon = row.area_type.toLowerCase();
          return { ...row, id: index, icon: icon === 'null' ? 'entry' : icon };
        }),
      );
    }

    async function centersCustomerHeatmapFetch({ center_name, customer }) {
      const { fromTime, toTime } = getRequestData(activeFilter, global);

      if (!customer) {
        setSelectedCustomerHeatmap(null);
        return;
      }

      const { global_identity } = customer;
      const { data } = await timelineService.getTimelineCustomerPositionHeatmap(
        {
          center_name,
          global_identity,
          from_time: fromTime,
          to_time: toTime,
        },
      );
      setSelectedCustomerHeatmap(data);
    }

    centersCustomerJourneyFetch({
      center,
      customer: selectedCustomer,
    });
    centersCustomerHeatmapFetch({
      center,
      customer: selectedCustomer,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer]);

  const {
    customerCnt,
    podsCnt,
    localsPercent,
    foreignPercent,
    femalePercent,
    malePercent,
    avgWaitingTime,
  } =
    store.user.role !== config.roles.EMPLOYEE && activeFilter === 0
      ? getLiveCustomerStatics(centers)
      : getPastCustomerStatics(timeline);
  const customers = getCustomers(centers);
  const { areas } = getAreaStatistics(centers);
  const heatmapData = getHeatmapTimeline(timeline);
  const floorPlanInfo = getFloorPlanInfo(centers);
  const zones = getZones(centers);
  const loading = global?.loading;
  const centersInfoLoading = loading?.centersInfo;
  const centersHxAreaLoading = loading?.centersHxArea;
  const centersZonesLoading = loading?.centersZones;
  const timelineHeatmapLoading = loading?.timelineHeatmap;
  const timelineAttendanceLoading = loading?.timelineAttendance;
  const isDetailedMode = !!selectedCustomer;

  return (
    <BlockWrapper
      title="customer_dashboard__insight_title"
      isIndicator={activeFilter === 0}
      prefix={activeFilter === 0 ? 'Live' : ''}
      isTitleShow={!isDetailedMode}
    >
      <div className={classes.mainWrapper}>
        {!onlyMap && (
          <div className={classes.left}>
            {!isDetailedMode && (
              <>
                <div className={classes.customerDetails}>
                  <CustomerDetails
                    malePercent={malePercent}
                    femalePercent={femalePercent}
                    customerCnt={customerCnt}
                    localsPercent={localsPercent}
                    foreignPercent={foreignPercent}
                    podsCnt={podsCnt}
                    avgWaitingTime={avgWaitingTime}
                    loading={centersInfoLoading || timelineAttendanceLoading}
                  />
                </div>
                {store.user.role !== config.roles.EMPLOYEE && (
                  <div className={classes.hxArea}>
                    <HxArea
                      data={areas}
                      activeBtnId={activeBtnId}
                      setActiveBtnId={setActiveBtnId}
                      loading={centersHxAreaLoading}
                    />
                  </div>
                )}
                <div className={classes.customerList}>
                  <CustomerList onExpand={openCustomerList} />
                </div>
              </>
            )}
            {isDetailedMode && (
              <>
                <CustomerDetail data={selectedCustomer} />
                <CustomerJourney journeys={selectedCustomerJourneys} />
              </>
            )}
          </div>
        )}
        <div className={classes.right}>
          {(store.user.role !== config.roles.EMPLOYEE || onlyLive) &&
            activeFilter === FILTER_LIVE_ID &&
            !isDetailedMode && (
              <CustomerMap
                customers={customers}
                floorPlanInfo={floorPlanInfo}
                zones={zones}
                selectedZoneId={activeBtnId}
                loading={centersInfoLoading || centersZonesLoading}
                onSelectCustomer={onSelectCustomer}
              />
            )}
          {((store.user.role === config.roles.EMPLOYEE && !onlyLive) ||
            activeFilter > FILTER_LIVE_ID ||
            isDetailedMode) && (
            <CustomerHeatmap
              heatmapData={
                isDetailedMode ? selectedCustomerHeatmap : heatmapData
              }
              floorPlanInfo={floorPlanInfo}
              zones={zones}
              selectedZoneId={activeBtnId}
              isDetailedMode={isDetailedMode}
              loading={
                centersInfoLoading ||
                centersZonesLoading ||
                timelineHeatmapLoading
              }
            />
          )}
        </div>
      </div>
    </BlockWrapper>
  );
}

Insights.propTypes = {
  openCustomerList: PropTypes.func,
  onlyMap: PropTypes.bool,
  onlyLive: PropTypes.bool,
  selectedCustomer: PropTypes.objectOf(PropTypes.shape),
  onSelectCustomer: PropTypes.func,
};

Insights.defaultProps = {
  openCustomerList: () => {},
  onlyMap: false,
  onlyLive: false,
  selectedCustomer: {},
  onSelectCustomer: () => {},
};

export default React.memo(Insights);
