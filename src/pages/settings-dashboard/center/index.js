import React, { useContext } from 'react';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import CenterCard from '../../../components/settings/center-card';
import { Store } from '../../../store';
import centerService from '../../../services/center.service';
import { storeCentersInfo } from '../../../store/actions/centers';
import classes from './center.module.scss';

function getCenterInfo(centers) {
  if (centers && centers.centerInfo) {
    const { centerInfo } = centers;
    return centerInfo;
  }
  return {
    name: '',
    address: '',
    location: '',
    phone: '',
    manager_email: '',
    employee_list: [],
  };
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

function Center() {
  const [store, dispatch] = useContext(Store);
  const { centers } = store;
  const centerData = getCenterInfo(centers);
  const zones = getZones(centers);

  const onUpdateCenter = async (data) => {
    const {
      distance_points,
      floor_plan,
      floor_plan_px_per_meter,
      location,
      manager_email,
      manager_name,
      name,
      scale_meters,
    } = data;
    const body = {
      distance_points,
      floor_plan,
      floor_plan_scale: floor_plan_px_per_meter,
      location,
      manager_email,
      manager_name,
      name,
      scale_meters,
    };

    const { data: centerResponse } = await centerService.updateCenter(body);
    dispatch(storeCentersInfo(centerResponse));
  };

  return (
    <BlockWrapper title="settings_dashboard__center_title">
      <div className={classes.mainWrapper} data-testid="home-manager-page">
        <CenterCard data={centerData} zones={zones} onSave={onUpdateCenter} />
      </div>
    </BlockWrapper>
  );
}

export default Center;
