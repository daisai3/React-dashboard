import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import { Store } from '../../../store';
import Area from '../../../components/happiness-experience/hxArea';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import Spinner from '../../../components/shared/spinner';
import { FIXED_CNT } from '../../../utils';
import classes from './hx-area.module.scss';

function getHappinessArea(centers) {
  let happinessArea = [];

  if (centers && centers.happinessArea) {
    const _happinessArea = centers.happinessArea;
    happinessArea = _happinessArea.map((row, index) => {
      const { area_type, happiness_avg } = row;
      return {
        ...row,
        id: index,
        area_type: area_type?.toLowerCase(),
        happiness_avg: !Number.isInteger(happiness_avg)
          ? happiness_avg.toFixed(FIXED_CNT)
          : happiness_avg,
      };
    });
  }
  return happinessArea;
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

function HxArea() {
  const [store] = useContext(Store);
  const { centers, global } = store;
  const happinessArea = getHappinessArea(centers);
  const floorPlanInfo = getFloorPlanInfo(centers);
  const zones = getZones(centers);
  const loading = global?.loading;
  const hxAreaLoading =
    loading?.centersInfo || loading?.centersZones || loading?.centersHxArea;

  return (
    <BlockWrapper title="hx_dashboard__hx_area_title">
      <div className={cx(classes.descritpion, 'text-normal')}>
        <FormattedMessage
          id="hx_dashboard__hx_area_descrption"
          defaultMessage=""
        />
      </div>
      <div className={classes.content}>
        {hxAreaLoading ? (
          <div className={cx(classes.spinnerContainer, 'Spinner_contained')}>
            <Spinner />
          </div>
        ) : (
          <Area
            data={happinessArea}
            floorPlanInfo={floorPlanInfo}
            zones={zones}
          />
        )}
      </div>
    </BlockWrapper>
  );
}

export default React.memo(HxArea);
