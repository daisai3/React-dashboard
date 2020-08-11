import * as types from '../types';

export function storeCentersWaitingTime(data) {
  return { type: types.STORE_CENTERS_WAITING_TIME, payload: data };
}

export function storePeopleWaitingDemographics(data) {
  return { type: types.STORE_PEOPLE_WAITING_DEMOGRAPHICS, payload: data };
}

export function storeCentersInfo(data) {
  return { type: types.STORE_CENTERS_INFO, payload: data };
}

export function storeCentersJourney(data) {
  return { type: types.STORE_CENTERS_JOURNEY, payload: data };
}

export function storeCentersCommonJourneys(data) {
  return { type: types.STORE_CENTERS_COMMON_JOURNEYS, payload: data };
}

export function storeCentersHappinessArea(data) {
  return { type: types.STORE_CENTERS_HAPPINESS_AREA, payload: data };
}

export function storeCentersZones(data) {
  return { type: types.STORE_CENTERS_ZONES, payload: data };
}

export function storeCentersCustomers(data) {
  return { type: types.STORE_CENTERS_CUSTOMERS, payload: data };
}

export function storeCentersAreaStatistics(data) {
  return { type: types.STORE_CENTERS_AREA_STATISTICS, payload: data };
}

export function storeCentersDwellStatistics(data) {
  return { type: types.STORE_CENTERS_DWELL_STATISTICS, payload: data };
}

export function clearCenters() {
  return { type: types.CLEAR_CENTERS };
}
