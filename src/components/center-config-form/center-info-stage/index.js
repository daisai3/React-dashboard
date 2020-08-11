import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classes from './stage-1.module.scss';
import DrawingCanvas from '../../drawing-canvas';
import { Store } from '../../../store';
import config from '../../../config';
import { DistanceBetween2Points } from '../../../utils';
import centerService from '../../../services/center.service';

function CenterInfoStage({ center, stage, setStage, updateForm }) {
  const [store] = useContext(Store);

  const [centerName, setCenterName] = useState(center?.name);
  const [address, setAddress] = useState(center?.location);
  const [managerName, setManagerName] = useState(center?.manager_name);
  const [managerEmail, setManagerEmail] = useState(center?.manager_email);
  const [floorPlan, setFloorPlan] = useState(center?.floor_plan);
  const [points, setPoints] = useState(center.distance_points);
  const [scaleDistance, setScaleDistance] = useState(
    DistanceBetween2Points(
      center.distance_points[0],
      center.distance_points[1],
    ),
  );
  const [scaleMeters, setScaleMeters] = useState(center.scale_meters);

  function formHandler() {
    const body = {
      name: centerName,
      location: address,
      manager_name: managerName,
      manager_email: managerEmail,
      floor_plan: floorPlan,
      floor_plan_scale: scaleDistance / (scaleMeters || 1),
      scale_meters: scaleMeters,
      distance_points: points,
    };
    updateForm(body);
    centerService.updateCenter(body);
    setStage(stage + 1);
  }

  return (
    <div data-testid="stage-1" className={classes.mainWrapper}>
      <div className={classes.formWrapper}>
        <h3>
          <FormattedMessage
            id="center_config__center_info"
            defaultMessage="Center Information"
          />
        </h3>
        <div
          className={classes.centerConfigForm}
          data-testid="center-config-form"
        >
          <label htmlFor="center_name">
            <FormattedMessage
              id="center_config__center_name"
              defaultMessage="Name"
            />
            <input
              disabled // store.user.role === config.roles.LOCAL
              name="center_name"
              type="text"
              value={centerName}
              onChange={(event) => {
                setCenterName(event.target.value);
              }}
            />
          </label>
        </div>
        <div className={classes.centerConfigForm}>
          <label htmlFor="center_address">
            <FormattedMessage
              id="center_config__center_address"
              defaultMessage="Address"
            />
            <textarea
              disabled={store.user.role === config.roles.LOCAL}
              name="center_address"
              type="text"
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
              }}
            />
          </label>
        </div>
        <div className={classes.centerConfigForm}>
          <label htmlFor="manager_name">
            <FormattedMessage
              id="center_config__manager_name"
              defaultMessage="Manager's Name"
            />
            <input
              disabled={store.user.role === config.roles.LOCAL}
              name="manager_name"
              type="text"
              value={managerName}
              onChange={(event) => {
                setManagerName(event.target.value);
              }}
            />
          </label>
        </div>
        <div className={classes.centerConfigForm}>
          <label htmlFor="manager_email">
            <FormattedMessage
              id="center_config__manager_email"
              defaultMessage="Manager's Email"
            />
            <input
              disabled={store.user.role === config.roles.LOCAL}
              name="manager_email"
              type="text"
              value={managerEmail}
              onChange={(event) => {
                setManagerEmail(event.target.value);
              }}
            />
          </label>
        </div>

        <button
          disabled={
            !centerName ||
            !address ||
            !managerName ||
            !managerEmail ||
            !floorPlan
          }
          className="Global_btn Global_btn_green Global_align_right"
          type="button"
          onClick={formHandler}
        >
          Next
        </button>
      </div>
      <div className={classes.imageWrapper}>
        <small>Click on the map to draw a reference scale</small>

        <div>
          <label htmlFor="meters">
            <FormattedMessage
              id="center_config__meters_scale"
              defaultMessage="Meters on line"
            />{' '}
            <input
              style={{ marginLeft: 14 }}
              placeholder="Meters selected"
              type="number"
              value={scaleMeters}
              onChange={(event) => {
                setScaleMeters(event.target.value);
              }}
            />
          </label>
        </div>
        <DrawingCanvas
          image={floorPlan}
          withLines
          alignLeft
          maxPoints={2}
          imageUpdate={(imgSrc) => {
            setFloorPlan(imgSrc);
          }}
          updatedCoordsHandler={(coords) => {
            setPoints(coords);
            if (coords.length === ['x', 'y'].length) {
              setScaleDistance(DistanceBetween2Points(coords[0], coords[1]));
            }
          }}
          initialCoords={points}
        />
      </div>
    </div>
  );
}

CenterInfoStage.propTypes = {
  center: PropTypes.shape({
    avg_waiting_time: PropTypes.number,
    customer_list: PropTypes.arrayOf(
      PropTypes.shape({
        age_range: PropTypes.string,
        area: PropTypes.string,
        center_name: PropTypes.string,
        dwell_time: PropTypes.number,
        epoch_second: PropTypes.number,
        ethnicity: PropTypes.string,
        gender: PropTypes.string,
        global_identity: PropTypes.string,
        happiness_index: PropTypes.number,
        position_x: PropTypes.number,
        position_y: PropTypes.number,
      }),
    ),
    employee_list: PropTypes.arrayOf(
      PropTypes.shape({
        center_name: PropTypes.string,
        designated_zone_name: PropTypes.string,
        email: PropTypes.string,
        is_active: PropTypes.string,
        job_title: PropTypes.string,
        language: PropTypes.string,
        name: PropTypes.string,
        photo: PropTypes.string,
        working_hours: PropTypes.string,
      }),
    ),
    floor_plan: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    location: PropTypes.string,
    manager_email: PropTypes.string,
    manager_name: PropTypes.string,
    name: PropTypes.string,
    distance_points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    scale_meters: PropTypes.number,
  }),
  stage: PropTypes.number,
  setStage: PropTypes.func,
  updateForm: PropTypes.func,
};

export default CenterInfoStage;
