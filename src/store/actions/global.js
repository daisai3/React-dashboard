import * as types from '../types';

export function storeActiveFilter(data) {
  return { type: types.STORE_ACTIVE_FILTER, payload: data };
}

export function storeLoading(data) {
  return { type: types.STORE_LOADING, payload: data };
}

export function clearLoading() {
  return { type: types.CLEAR_LOADING };
}

export function storeCalendarRange(data) {
  return { type: types.STORE_CALENDAR_RANGE, payload: data };
}
