import Axios from 'axios';
import { getAPIURL } from '../utils';

const BASE_PATH = '/api/v1/calibration';
const FULL_URL = `${getAPIURL()}${BASE_PATH}`;

function sendCameraConfig(cameraConfig) {
  return Axios.post(`${FULL_URL}/camera_calibration`, {
    cameraConfig,
  });
}

export default {
  sendCameraConfig,
};
