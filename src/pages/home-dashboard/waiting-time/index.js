import React, { useContext } from 'react';
import { Store } from '../../../store';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import LiveWaitingTime from '../../../components/waiting-time/live-waiting-time';
import MainFactors from '../../../components/waiting-time/main-factors';
import classes from './waiting-time.module.scss';

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

function getWaitingFactorsData(centers) {
  let waitingFactors = [];
  if (centers && centers.waitingTime) {
    const { waitingTime } = centers;
    waitingFactors = waitingTime.waiting_factors.map((row, index) => {
      return {
        ...row,
        id: index,
      };
    });
  }

  return { waitingFactors };
}

function WaitingTimeBlock() {
  const [store] = useContext(Store);
  const { global, centers } = store;
  const activeFilter = global ? global.filter.id : 0;
  const {
    totalWaitingTime,
    waitingAreaAttendance,
    totalCnt,
  } = getWaitingTimeData(centers);
  const { waitingFactors } = getWaitingFactorsData(centers);
  const loading = global?.loading;
  const centersWaitingLoading = loading?.centersWaiting;
  return (
    <BlockWrapper title="wating_time" isDetails to="waiting-time">
      <div className={classes.mainWrapper}>
        <div className={classes.liveWaiting}>
          <LiveWaitingTime
            activeFilter={activeFilter}
            totalWaitingTime={totalWaitingTime}
            waitingAreaAttendance={waitingAreaAttendance}
            totalCnt={totalCnt}
            loading={centersWaitingLoading}
          />
        </div>
        <div className={classes.mainFactors}>
          <MainFactors
            waitingFactors={waitingFactors}
            loading={centersWaitingLoading}
          />
        </div>
      </div>
    </BlockWrapper>
  );
}

export default React.memo(WaitingTimeBlock);
