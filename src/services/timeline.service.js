import Axios from 'axios';
import { appendParams, getAPIURL } from '../utils';

const BASE_PATH = '/api/v1/timeline';
const FULL_URL = `${getAPIURL()}${BASE_PATH}`;

function getStagesTimeline(center, customer, from_time) {
  return Axios.get(
    appendParams(`${FULL_URL}/stages`, { center, customer, from_time }),
  );
}

function getHappinessTimeline(center, customer, from_time) {
  return Axios.get(
    appendParams(`${FULL_URL}/happiness`, { center, customer, from_time }),
  );
}

function getTimelineHeatmap(center, from_time, to_time) {
  return Axios.get(
    appendParams(`${FULL_URL}/position_heatmap`, {
      center,
      from_time,
      to_time,
    }),
  );
}

function getTimelineJourney({ center, from_time, to_time }) {
  return Axios.get(
    appendParams(`${FULL_URL}/journey-summary`, {
      center,
      from_time,
      to_time,
    }),
  );
}

function getTimelineAttendance(center, from_time, to_time) {
  return Axios.get(
    appendParams(`${FULL_URL}/historic_attendance`, {
      center,
      from_time,
      to_time,
    }),
  );
}

function getTimelineHistory({
  center,
  history_type,
  from_time,
  to_time,
  time_interval,
}) {
  return Axios.get(
    appendParams(`${FULL_URL}/history`, {
      center,
      history_type,
      from_time,
      to_time,
      time_interval,
    }),
  );
}

function getFootageTimeline({ center, customer, from_time }) {
  return Axios.get(
    appendParams(`${FULL_URL}/footage`, { center, customer, from_time }),
  );
}

function getAllHXTimelinesFromCenter(center, startDate) {
  const milliseconds = 1000;
  const promises = center.customer_list.map((customer) =>
    getHappinessTimeline(
      customer.global_identity,
      startDate.getTime() / milliseconds,
    ),
  );
  return Promise.all(promises);
}

function getHistory(center, history_type, from_time, to_time, time_interval) {
  return Axios.post(`${FULL_URL}/history`, {
    center,
    history_type,
    from_time,
    to_time,
    time_interval,
  });
}

function getMostTraveledJourneys({ center, from_time, to_time }) {
  return Axios.get(
    appendParams(`${FULL_URL}/most-traveled-journeys`, {
      center,
      from_time,
      to_time,
    }),
  );
}

function getTimelinePositionDwellHeatmap({ center, from_time, to_time }) {
  return Axios.get(
    appendParams(`${FULL_URL}/position_dwell_heatmap`, {
      center,
      from_time,
      to_time,
    }),
  );
}

function getTimelineCustomerPositionHeatmap({
  center,
  from_time,
  to_time,
  global_identity,
}) {
  return Axios.get(
    appendParams(`${FULL_URL}/customer_position_heatmap`, {
      center,
      from_time,
      to_time,
      global_identity,
    }),
  );
}

export default {
  getStagesTimeline,
  getTimelineHistory,
  getTimelineJourney,
  getTimelineHeatmap,
  getTimelineAttendance,
  getAllHXTimelinesFromCenter,
  getFootageTimeline,
  getHistory,
  getHappinessTimeline,
  getMostTraveledJourneys,
  getTimelinePositionDwellHeatmap,
  getTimelineCustomerPositionHeatmap,
};
