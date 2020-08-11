import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Modal from '../../../shared/modal';
import CameraCalibration from '../../camera-calibration';
import classes from './camera-card.module.scss';
import DrawingCanvas from '../../../drawing-canvas';

function CameraCard({ index, camera, updateValue, floor_plan }) {
  const [showCameraPosition, setShowCameraPosition] = useState(false);
  const [showCameraToMapRelation, setShowCameraToMapRelation] = useState(false);

  const [cameraScreenImage, setCameraScreenImage] = useState(camera.camera_img);

  function handleImageInput(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (imgLoaded) => {
        const mainCanvas = document.createElement('canvas');
        const ctx = mainCanvas.getContext('2d');
        const tempImg = new Image();
        tempImg.onload = () => {
          mainCanvas.width = tempImg.naturalWidth;
          mainCanvas.height = tempImg.naturalHeight;
          ctx.drawImage(
            tempImg,
            0,
            0,
            tempImg.naturalWidth,
            tempImg.naturalHeight,
          );
          const imageURL = mainCanvas.toDataURL();
          setCameraScreenImage(imageURL);
          updateValue('camera_img', imageURL, index);
        };
        tempImg.src = imgLoaded.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className={classes.inputWrapper}>
      <label htmlFor="camera ID">
        <FormattedMessage
          id="camera_box__camera_id"
          defaultMessage="Camera ID"
        />
        <input
          type="text"
          value={camera.camera_id}
          name="camera ID"
          onChange={(event) => {
            updateValue('camera_id', event.target.value, index);
          }}
        />
      </label>
      <label htmlFor="Resolution">
        <FormattedMessage
          id="camera_box__resolution"
          defaultMessage="Resolution"
        />
        <input
          type="text"
          name="Resolution"
          value={camera.resolution}
          onChange={(event) => {
            updateValue('resolution', event.target.value, index);
          }}
        />
      </label>
      <label htmlFor="Focal Length">
        <FormattedMessage
          id="camera_box__focal_length"
          defaultMessage="Focal Length"
        />
        <input
          type="text"
          name="Focal Length"
          value={camera.focal_length}
          onChange={(event) => {
            updateValue('focal_length', event.target.value, index);
          }}
        />
      </label>
      <label htmlFor="camera RTSP">
        <FormattedMessage
          id="camera_box__camera_RTSP"
          defaultMessage="Camera RTSP"
        />
        <input
          type="text"
          name="camera RTSP"
          value={camera.cameraRTSP}
          onChange={(event) => {
            updateValue('cameraRTSP', event.target.value, index);
          }}
        />
      </label>
      <label htmlFor="camera_encoding">
        <FormattedMessage
          id="camera_box__camera_encoding"
          defaultMessage="Select camera encoding"
        />
        <select
          name="camera_encoding"
          onBlur={(event) => {
            updateValue('encoding', event.target.value, index);
          }}
          onChange={(event) => {
            updateValue('encoding', event.target.value, index);
          }}
        >
          <option value="H264">H264</option>
          <option value="H265">H265</option>
        </select>
      </label>
      <label htmlFor="camera image">
        <FormattedMessage
          id="camera_box__camera_image"
          defaultMessage="Upload still image of camera feed"
        />
        <input
          name="camera_image"
          type="file"
          accept="image/x-png,image/gif,image/jpeg"
          onChange={handleImageInput}
        />
      </label>

      <div className={classes.btnGroup}>
        <button
          onClick={() => {
            setShowCameraPosition(!showCameraPosition);
          }}
          className="Global_btn Global_btn_green"
          type="button"
        >
          Select Camera Position
        </button>
        <button
          disabled={!cameraScreenImage}
          onClick={() => {
            setShowCameraToMapRelation(!showCameraToMapRelation);
          }}
          className="Global_btn Global_btn_green"
          type="button"
        >
          Set Camera View to Floor Map Relation
        </button>
      </div>
      {showCameraPosition && (
        <Modal>
          <h4>
            <FormattedMessage
              id="camera_card__camera_location"
              defaultMessage="Click on the 2D map to indicate where the camera is located"
            />
          </h4>
          <DrawingCanvas
            noUpload
            image={floor_plan}
            maxPoints={1}
            updatedCoordsHandler={(values) => {
              updateValue('camera_position', values, index);
            }}
            initialCoords={camera.camera_position}
          />
          <button
            type="button"
            className="Global_btn Global_btn_green"
            onClick={() => {
              setShowCameraPosition(!showCameraPosition);
            }}
          >
            <FormattedMessage id="CLOSE" defaultMessage="Close" />
          </button>
        </Modal>
      )}
      {showCameraToMapRelation && (
        <Modal>
          <h4>
            <FormattedMessage
              id="camera_card__map_to_camera_relation_title"
              defaultMessage="Click some references in the camera image and locate them in the 2d map"
            />
          </h4>
          <CameraCalibration
            updateCoords={({ floor_coords, camera_coords }) => {
              updateValue('floor_coords', floor_coords, index);
              updateValue('camera_coords', camera_coords, index);
            }}
            floor_plan={floor_plan}
            camera_screen={cameraScreenImage}
            floor_coords={camera.floor_coords}
            camera_coords={camera.camera_coords}
          />
          <button
            type="button"
            className="Global_btn Global_btn_green"
            onClick={() => {
              setShowCameraToMapRelation(!showCameraToMapRelation);
            }}
          >
            <FormattedMessage id="CLOSE" defaultMessage="Close" />
          </button>
        </Modal>
      )}
    </div>
  );
}

CameraCard.propTypes = {
  index: PropTypes.number,
  camera: PropTypes.shape({
    camera_id: PropTypes.string,
    resolution: PropTypes.string,
    focal_length: PropTypes.string,
    cameraRTSP: PropTypes.string,
    camera_position: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    floor_coords: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    camera_coords: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    camera_img: PropTypes.string,
  }),
  updateValue: PropTypes.func,
  floor_plan: PropTypes.string,
};

export default CameraCard;
