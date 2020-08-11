import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import LiveCustomers from '../../../components/customers-and-visitors/live-customers';
import Gender from '../../../components/customers-and-visitors/gender';
import Mask from '../../../components/customers-and-visitors/mask';
import { Store } from '../../../store';
import { TOTAL_PERCENTAGE, FIXED_CNT } from '../../../utils';
import classes from './customers-and-visotors.module.scss';

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

function getPastCustomerStatics(timeline) {
  const podsCnt = 0;
  let customerCnt = 0;
  let localsCnt = 0;
  let masksPercent = 0;
  let femalePercent = 0;
  let malePercent = 0;

  if (timeline && timeline.attendance) {
    const { attendance } = timeline;
    const femaleCnt = attendance.Female;
    const masksCnt = attendance.mask_on;
    customerCnt = attendance.total_customers;
    localsCnt = attendance.Local;

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

function CustomersBlock() {
  const [store] = useContext(Store);
  const { global, centers, timeline } = store;
  const activeFilter = global ? global.filter.id : 0;

  const {
    customerCnt,
    localsCnt,
    podsCnt,
    masksPercent,
    femalePercent,
    malePercent,
  } =
    activeFilter === 0
      ? getLiveCustomerStatics(centers)
      : getPastCustomerStatics(timeline);

  const loading = global?.loading;
  const centersInfoLoading = loading?.centersInfo;

  return (
    <BlockWrapper title="customers_and_visitors" isDetails to="customers">
      <div className={classes.mainWrapper}>
        <div className={classes.topWrapper}>
          <LiveCustomers
            customerCnt={customerCnt}
            localsCnt={localsCnt}
            podsCnt={podsCnt}
            loading={centersInfoLoading}
          />
        </div>
        <div className={classes.bottomWrapper}>
          <div className={classes.gender}>
            <Gender
              malePercent={malePercent}
              femalePercent={femalePercent}
              loading={centersInfoLoading}
            />
          </div>
          <div className={classes.mask}>
            <Mask masksPercent={masksPercent} loading={centersInfoLoading} />
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}

export default React.memo(CustomersBlock);
