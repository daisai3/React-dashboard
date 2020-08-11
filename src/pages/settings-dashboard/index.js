import React, { useState, useEffect, useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import SettingsProfile from './profile';
import SettingsCenter from './center';
import Icon from '../../components/shared/svgIcon';
import centerService from '../../services/center.service';
import userService from '../../services/user.service';
import {
  NORMAL_ICON_WIDTH,
  getRequestData,
  isObjectsSame,
  isArraysSame,
} from '../../utils';
import { Store } from '../../store';
import {
  storeCentersInfo,
  storeCentersZones,
  clearCenters,
} from '../../store/actions/centers';
import classes from './settings-dashboard.module.scss';
import config from '../../config';

function SettingsDashboard() {
  const [loading, setLoading] = useState(true);
  const [store, dispatch] = useContext(Store);
  const { user, centers } = store;
  const centersRef = useRef();
  const center = user.center_name;

  useEffect(() => {
    centersRef.current = centers;
  });

  useEffect(() => {
    dispatch(clearCenters());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (loading) return () => {};

    // get data for selected center
    async function centersInfoFetch() {
      const { fromTime, toTime } = getRequestData();
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
    }
    // get data for zones
    async function centersZonesFetch() {
      const { data: newCenterZones } = await centerService.getZones(center);
      const oldCenterZones =
        centersRef.current && centersRef.current.zones
          ? centersRef.current.zones
          : [];
      if (!isArraysSame(oldCenterZones, newCenterZones)) {
        dispatch(storeCentersZones(newCenterZones));
      }
    }
    centersInfoFetch();
    centersZonesFetch();
    return () => {};
  }, [dispatch, loading, center]);

  const onLogout = async () => {
    await userService.logout();
  };

  return (
    <div className={classes.mainContainer} data-testid="home-manager-page">
      <div className={classes.header}>
        <div className="pg-title">
          <FormattedMessage
            id="settings_dashboard_title"
            defaultMessage="Settings"
          />
        </div>
        <div className={classes.logout}>
          <button type="button" className="text-normal" onClick={onLogout}>
            <span className={classes.icon}>
              <Icon name="logout" width={NORMAL_ICON_WIDTH} />
            </span>
            <span>
              <FormattedMessage
                id="settings_dashboard__logout_btn_text"
                defaultMessage="Log out"
              />
            </span>
          </button>
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.profileWrapper}>
          <SettingsProfile />
        </div>
        {config.roles.EMPLOYEE !== store.user.role && (
          <div className={classes.centerWrapper}>
            <SettingsCenter />
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsDashboard;
