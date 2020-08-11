import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StageIndicator from './stage-indicator';
import CenterInfoStage from './center-info-stage';

import classes from './center-config-form.module.scss';
import CamerasStage from './cameras-stage';
import AreasStage from './areas-stage';

const stages = [CenterInfoStage, CamerasStage, AreasStage];

function CameraConfigForm({ center }) {
  const [stage, setStage] = useState(0);
  const [formValue, setFormValue] = useState({});

  function renderStage() {
    const stagesComps = stages.map((Stage) => (
      <Stage
        stage={stage}
        form={formValue}
        center={{ ...center, ...formValue }}
        setStage={() => {
          if (stage + 1 < stages.length) {
            setStage(stage + 1);
          }
        }}
        updateForm={(form) => {
          setFormValue({ ...formValue, ...form });
        }}
      />
    ));
    if (center) return stagesComps[stage];
    return null;
  }

  return (
    <div className={classes.mainWrapper}>
      <StageIndicator
        numberOfStages={stages.length}
        stage={stage}
        setStage={setStage}
      />
      {renderStage()}
    </div>
  );
}

CameraConfigForm.propTypes = {
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
  }),
};

export default CameraConfigForm;
