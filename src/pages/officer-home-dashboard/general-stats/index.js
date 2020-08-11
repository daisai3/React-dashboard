import React, { useContext } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import LiveHX from '../../../components/happiness-experience/live-hx';
import Summary from '../../../components/happiness-experience/summary';
import { Store } from '../../../store';
import { TOTAL_PERCENTAGE, FIXED_CNT } from '../../../utils';
import LiveCustomers from '../../../components/customers-and-visitors/live-customers';
import Mask from '../../../components/customers-and-visitors/mask';
import classes from './general-stats.module.scss';
import Spinner from '../../../components/shared/spinner';
import Icon from '../../../components/shared/svgIcon';

dayjs.extend(utc);

function getWaitingTimeData(centers) {
  let totalWaitingTime = 0;
  let waitingAreaAttendance = [];
  let totalCnt = 0;
  if (centers && centers.waitingTime) {
    const { waitingTime } = centers;
    totalWaitingTime = waitingTime.total_waiting_time;
    waitingAreaAttendance = waitingTime.waiting_areas_attendance.map(
      (row, index) => {
        return {
          ...row,
          id: index,
        };
      },
    );
    totalCnt = waitingTime.total_ppl_waiting;
  }

  return { totalWaitingTime, waitingAreaAttendance, totalCnt };
}

function getLiveCustomerStatics(centers) {
  const podsCnt = 0;
  let customerCnt = 0;
  let localsCnt = 0;
  let masksPercent = 0;
  let femalePercent = 0;
  let malePercent = 0;

  if (centers && centers.centerInfo) {
    const {
      centerInfo: { customer_list },
    } = centers;
    const femaleCnt = customer_list.filter((row) => row.gender === 'Female')
      .length;
    const masksCnt = customer_list.filter((row) => row.mask === 'Mask').length;

    customerCnt = customer_list.length;
    localsCnt = customer_list.filter((row) => row.ethnicity === 'Local').length;

    if (customerCnt > 0) {
      femalePercent = (femaleCnt * TOTAL_PERCENTAGE) / customerCnt;
      malePercent = TOTAL_PERCENTAGE - femalePercent;

      masksPercent = (masksCnt * TOTAL_PERCENTAGE) / customerCnt;
      if (!Number.isInteger(femalePercent)) {
        femalePercent = Number(femalePercent.toFixed(FIXED_CNT));
        malePercent = Number(malePercent.toFixed(FIXED_CNT));
      }
      if (!Number.isInteger(masksPercent)) {
        masksPercent = Number(masksPercent.toFixed(FIXED_CNT));
      }
    }
  }
  return {
    customerCnt,
    localsCnt,
    podsCnt,
    masksPercent,
    femalePercent,
    malePercent,
  };
}

function getSummaryValues({ timeline }) {
  let hxTimeline = [];
  if (timeline && timeline.hx) hxTimeline = timeline.hx;

  const values = hxTimeline.map((row) => row.total_avg);
  const minValue = values.length > 0 ? _.minBy(values) : 0;
  const maxValue = values.length > 0 ? _.maxBy(values) : 0;
  const avgValue =
    values.length > 0 ? Number(_.meanBy(values).toFixed(FIXED_CNT)) : 0;

  let liveValue = 0;
  if (values.length > 0) {
    const lastHX = values.slice(-1);
    const [lastHXValue] = lastHX;
    liveValue = lastHXValue;
    if (!Number.isInteger(liveValue)) {
      liveValue = liveValue.toFixed(1);
    }
  }
  return { minValue, maxValue, avgValue, liveValue };
}

function LiveMetrics() {
  const [store] = useContext(Store);
  const { timeline, global, centers } = store;

  const { customerCnt, podsCnt, masksPercent } = getLiveCustomerStatics(
    centers,
  );
  const { liveValue, minValue, maxValue, avgValue } = getSummaryValues({
    timeline,
  });

  const { totalWaitingTime, totalCnt } = getWaitingTimeData(centers);

  const loading = global?.loading;
  const hxLoading = loading?.hxTimeline;
  const centersInfoLoading = loading?.centersInfo;
  const centersWaitingLoading = loading?.centersWaiting;

  return (
    <BlockWrapper title="officer_home_summary__title">
      <div className={classes.mainWrapper}>
        <div className={classes.bottomWrapper}>
          <div className={classes.liveHxWrapper}>
            <LiveHX isPadding value={liveValue} loading={hxLoading} />
          </div>
          <div className={classes.summaryWrapper}>
            <Summary
              isPadding
              minValue={minValue}
              maxValue={maxValue}
              avgValue={avgValue}
              loading={hxLoading}
            />
          </div>
          <div className={classes.contentWrapper}>
            <div className={classes.live}>
              <div className={cx(classes.value, 'text-smaller')}>
                {centersInfoLoading ? (
                  <div
                    className={cx(
                      classes.spinnerContainer,
                      'Spinner_contained',
                    )}
                  >
                    <Spinner width={16} />
                  </div>
                ) : (
                  <span>{customerCnt}</span>
                )}
              </div>
              <div className={cx(classes.label, 'text-small', 'text-center')}>
                Total People
              </div>
            </div>
          </div>
          <div className={classes.contentWrapper}>
            <div className={classes.live}>
              <div className={cx(classes.value, 'text-smaller')}>
                {centersInfoLoading ? (
                  <div
                    className={cx(
                      classes.spinnerContainer,
                      'Spinner_contained',
                    )}
                  >
                    <Spinner width={16} />
                  </div>
                ) : (
                  <span>{podsCnt}</span>
                )}
              </div>
              <div className={cx(classes.label, 'text-small', 'text-center')}>
                POD
              </div>
            </div>
          </div>
          <div className={classes.contentWrapper}>
            <div className={classes.live}>
              <div className={classes.bar}>
                {centersWaitingLoading ? (
                  <div
                    className={cx(
                      classes.spinnerContainer,
                      'Spinner_contained',
                    )}
                  >
                    <Spinner width={24} />
                  </div>
                ) : (
                  <span>{`${totalWaitingTime}'`}</span>
                )}
              </div>
              <div className={cx(classes.label, 'text-small', 'text-center')}>
                Wait time
              </div>
              <div className={cx(classes.detail, 'text-small', 'text-center')}>
                {totalCnt} people waiting
              </div>
            </div>
          </div>

          <div className={classes.maskContentWrapper}>
            <div className={cx(classes.status)}>
              <div className={classes.icon}>
                <Icon name="mask" />
              </div>
              <div className={cx(classes.value, 'text-smaller', 'text-center')}>
                {centersWaitingLoading ? (
                  <div
                    className={cx(
                      classes.spinnerContainer,
                      'Spinner_contained',
                    )}
                  >
                    <Spinner width={16} />
                  </div>
                ) : (
                  <span>{`${masksPercent}%`}</span>
                )}
              </div>
            </div>
            <div>
              <div className={cx(classes.label, 'text-small')}>
                People wearing masks
              </div>
              <div className={cx(classes.description, 'text-small')}>
                {`The ${masksPercent}% of customer and visitors are wearing masks in the center`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}

export default React.memo(LiveMetrics);
