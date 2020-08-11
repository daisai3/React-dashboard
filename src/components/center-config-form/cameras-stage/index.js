import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import CameraCard from './camera-card';
import classes from './stage-2.module.scss';
import { scss } from '../../../utils';
import calibrationService from '../../../services/calibration.service';

function CamerasStage({ center, stage, setStage, updateForm }) {
  function updateValue(field, value, index) {
    const copyArr = [...center.cameras];
    copyArr[index][field] = value;
    updateForm({ cameras: copyArr });
  }

  function addNewCamera() {
    const copyArr = [...(center.cameras || [])];
    copyArr.push({});
    updateForm({ cameras: copyArr });
  }

  return (
    <>
      <div className={classes.cameraListWrapper}>
        {center.cameras?.map((camera, i) => (
          <div key={`camera-${i}`} className={classes.addNewCameraBtn}>
            <CameraCard
              index={i}
              camera={camera}
              updateValue={updateValue}
              floor_plan={center.floor_plan}
            />
          </div>
        ))}
        <button
          onClick={addNewCamera}
          type="button"
          className={classes.addNewCameraBtn}
        >
          +
          <br />
          <FormattedMessage
            id="camera_config__add_camera"
            defaultMessage="Add camera"
          />
        </button>

        {/* this is needed for correct padding behavior on horizontal scrolling */}
        <div style={{ padding: 1 }} />
      </div>
      {center.cameras?.length > 0 && (
        <button
          onClick={() => {
            calibrationService.sendCameraConfig(center);
            setStage(stage + 1);
          }}
          type="button"
          className={scss('Global_btn', 'Global_btn_green', classes.nextBtn)}
        >
          <br />
          <FormattedMessage id="camera_config__Next" defaultMessage="Next" />
        </button>
      )}
    </>
  );
}

CamerasStage.propTypes = {
  center: PropTypes.shape({
    floor_plan: PropTypes.string,
    cameras: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  form: PropTypes.shape({
    floor_plan: PropTypes.string,
    cameras: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  stage: PropTypes.number,
  setStage: PropTypes.func,
  updateForm: PropTypes.func,
};

export default CamerasStage;
