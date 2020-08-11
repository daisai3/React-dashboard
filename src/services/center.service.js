import Axios from 'axios';
import { appendParams, getAPIURL } from '../utils';

const BASE_PATH = '/api/v1/centers';
const FULL_URL = `${getAPIURL()}${BASE_PATH}`;

function getCenter(center, from_time, to_time) {
  return Axios.get(
    appendParams(`${FULL_URL}/get_center_info`, { center, from_time, to_time }),
  );
}

function updateCenter(center) {
  return Axios.put(`${FULL_URL}/update_center_info`, center);
}

function getCentersName() {
  return Axios.get(`${FULL_URL}/select/`);
}

function getZonesName(center) {
  const url = appendParams(`${FULL_URL}/select/zones`, { center });
  return Axios.get(url);
}

function getZones(center) {
  const url = appendParams(`${FULL_URL}/zones`, { center });
  return Axios.get(url);
}

function updateZone(zones) {
  return Axios.put(`${FULL_URL}/zones`, zones);
}

function addZone(zone) {
  return Axios.post(`${FULL_URL}/zones`, zone);
}

function deleteZone(zone) {
  const url = appendParams(`${FULL_URL}/zones`, zone);
  return Axios.delete(url);
}

function getCenterWaitingTime({ center, from_time, to_time, live }) {
  return Axios.get(
    appendParams(`${FULL_URL}/waiting`, { center, from_time, to_time, live }),
  );
}

function getCenterHappinessArea({ center, from_time, to_time }) {
  return Axios.get(
    appendParams(`${FULL_URL}/area_happiness`, { center, from_time, to_time }),
  );
}

function getCenterCustomers({
  center,
  from_time,
  to_time,
  live,
  page,
  page_size,
}) {
  return Axios.get(
    appendParams(`${FULL_URL}/customers`, {
      center,
      from_time,
      to_time,
      live,
      page,
      page_size,
    }),
  );
}

function getCenterAreaStatistics({ center, from_time, to_time, is_live }) {
  return Axios.get(
    appendParams(`${FULL_URL}/area_statistics`, {
      center,
      from_time,
      to_time,
      is_live,
    }),
  );
}

function getCenterAreaDwellStatistics({ center, from_time, to_time }) {
  return Axios.get(
    appendParams(`${FULL_URL}/area_dwell_statistics`, {
      center,
      from_time,
      to_time,
    }),
  );
}

function getCenterCustomerJourney({ center, global_identity }) {
  return Axios.get(
    appendParams(`${FULL_URL}/customer_journey`, {
      center,
      global_identity,
    }),
  );
}

function getPeopleWaitingDemographics({ center, from_time, to_time, live }) {
  return Axios.get(
    appendParams(`${FULL_URL}/people_waiting_demographics`, {
      center,
      from_time,
      to_time,
      live,
    }),
  );
}

export default {
  getCenter,
  updateCenter,
  getCentersName,
  getZonesName,
  getZones,
  updateZone,
  addZone,
  deleteZone,
  getCenterWaitingTime,
  getCenterHappinessArea,
  getCenterCustomers,
  getCenterAreaStatistics,
  getCenterAreaDwellStatistics,
  getCenterCustomerJourney,
  getPeopleWaitingDemographics,
};
