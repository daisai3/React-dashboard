import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
// import Icon from '../../shared/svgIcon';
import Input from '../../shared/custom-input';
import FloorPlanBackground from '../../shared/map-floorplan/floorplan-background';
import FloorPlanAreas from '../../shared/map-floorplan/floorplan-areas';
import classes from './center-card.module.scss';
import { Store } from '../../../store';
import config from '../../../config';

const MAP_BG_HEIGHT = 248;

function CenterCard({ data, zones, onSave }) {
  const [center, setCenter] = useState({});
  const [store] = useContext(Store);
  const [originFloorPlanHeight, setOriginFloorPlanHeight] = useState(
    MAP_BG_HEIGHT,
  );
  const [originFloorPlanWidth, setOriginFloorPlanWidth] = useState(
    MAP_BG_HEIGHT,
  );

  useEffect(() => {
    setCenter(data);
  }, [data]);

  useEffect(() => {
    const _img = new Image();
    _img.onload = () => {
      setOriginFloorPlanWidth(_img.width);
      setOriginFloorPlanHeight(_img.height);
    };
    _img.src = center.floor_plan;
  }, [center.floor_plan]);

  const onChangeCenterInfo = (event) => {
    const {
      target: { name, value },
    } = event;

    const updatedData = {};
    switch (name) {
      case 'name':
        updatedData.name = value;
        break;
      case 'address':
        updatedData.address = value;
        break;
      case 'location':
        updatedData.location = value;
        break;
      case 'phone':
        updatedData.phone = value;
        break;
      case 'manager_email':
        updatedData.manager_email = value;
        break;

      default:
        break;
    }

    setCenter({ ...center, ...updatedData });
  };

  const onSaveCenter = () => {
    onSave(center);
  };

  return (
    <div className={classes.mainWrapper}>
      <div className={classes.content}>
        <div className={classes.left}>
          <div className={classes.map}>
            <FloorPlanBackground
              src={center.floor_plan}
              height={MAP_BG_HEIGHT}
            />
            <FloorPlanAreas
              height={MAP_BG_HEIGHT}
              originWidth={originFloorPlanWidth}
              originHeight={originFloorPlanHeight}
              zones={zones}
            />
          </div>
          <div className={cx(classes.infoWrapper, 'text-normal')}>
            <div className={classes.info}>
              <div className={classes.name}>{center.name}</div>
              <div className={classes.location}>{center.location}</div>
            </div>
            <div className={classes.editCenter}>
              <button
                type="button"
                onClick={() => {
                  navigate('/camera-config');
                }}
                className={classes.editCenterBtn}
              >
                Edit Center
              </button>
            </div>
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.inputsWrapper}>
            <div className="text-normal">
              <FormattedMessage
                id="settings_dashboard__center_inputs_title"
                defaultMessage="Edit Center Details"
              />
            </div>
            <div className={cx(classes.inputs, 'text-normal')}>
              <div className={classes.input}>
                <Input
                  label="Name"
                  name="name"
                  value={center.name}
                  placeholder="Burj Al Nahar"
                  onChange={onChangeCenterInfo}
                  readOnly
                />
              </div>
              {/* <div className={classes.input}>
                <Input
                  label="Address"
                  name="address"
                  value={center.address}
                  placeholder="Intersection of Muteena..."
                  onChange={onChangeCenterInfo}
                />
              </div> */}
              <div className={classes.input}>
                <Input
                  label="Location"
                  name="location"
                  value={center.location}
                  placeholder="Dubai - United Arab Emir..."
                  onChange={onChangeCenterInfo}
                  readOnly={store.user?.role !== config.roles.GLOBAL}
                />
              </div>
              <div className={classes.input}>
                <Input
                  label="Manager's Name"
                  name="manager_name"
                  value={center.manager_name}
                  placeholder="John Doe"
                  onChange={onChangeCenterInfo}
                  readOnly={store.user?.role !== config.roles.GLOBAL}
                />
              </div>
              <div className={classes.input}>
                <Input
                  label="E-mail address"
                  name="manager_email"
                  value={center.manager_email}
                  placeholder="john.doe@dewa.com"
                  onChange={onChangeCenterInfo}
                  readOnly={store.user?.role !== config.roles.GLOBAL}
                />
              </div>
              <div className={classes.input}>
                <Input
                  label="Number of employees"
                  name="employee_number"
                  value={`${String(center.employee_list?.length)} employee${
                    center.employee_list?.length > 1 ? 's' : ''
                  }`}
                  placeholder="23 employees"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className={classes.btnWrapper}>
            <button
              type="button"
              className={cx(classes.saveBtn, 'text-normal')}
              onClick={onSaveCenter}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

CenterCard.propTypes = {
  data: PropTypes.shape({
    center_name: PropTypes.string,
    designated_zone_name: PropTypes.string,
    email: PropTypes.string,
    is_active: PropTypes.string,
    job_title: PropTypes.string,
    language: PropTypes.string,
    name: PropTypes.string,
    photo: PropTypes.string,
    working_hours: PropTypes.string,
  }).isRequired,
  zones: PropTypes.arrayOf(PropTypes.shape({})),
  onSave: PropTypes.func,
};

CenterCard.defaultProps = {
  zones: [],
  onSave: () => {},
};

export default React.memo(CenterCard);
