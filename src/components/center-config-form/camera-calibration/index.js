import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DrawingCanvas from '../../drawing-canvas';

import classes from './camera-config-dashboard.module.scss';

function CameraCalibration({
  updateCoords,
  floor_plan,
  camera_screen,
  floor_coords,
  camera_coords,
}) {
  const [imageCoords, setImageCoords] = useState({
    floor_coords,
    camera_coords,
  });

  return (
    <>
      <div className={classes.pageWrapper} data-testid="camera-config-page">
        <div className={classes.formContainer}>
          <DrawingCanvas
            image={floor_plan}
            noUpload
            updatedCoordsHandler={(updatedCoords) => {
              setImageCoords({ ...imageCoords, floor_coords: updatedCoords });
              updateCoords({ ...imageCoords, floor_coords: updatedCoords });
            }}
            initialCoords={floor_coords}
          />
        </div>
        <div className={classes.configContainer}>
          <DrawingCanvas
            image={camera_screen}
            noUpload
            updatedCoordsHandler={(updatedCoords) => {
              setImageCoords({ ...imageCoords, camera_coords: updatedCoords });
              updateCoords({ ...imageCoords, camera_coords: updatedCoords });
            }}
            initialCoords={camera_coords}
          />
        </div>
      </div>
    </>
  );
}

CameraCalibration.propTypes = {
  updateCoords: PropTypes.func,
  camera_screen: PropTypes.string,
  floor_plan: PropTypes.string,
  floor_coords: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  camera_coords: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
};

export default CameraCalibration;
