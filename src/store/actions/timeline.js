import * as types from '../types';

export function storeTimelineHX(data) {
  return { type: types.STORE_TIMELINE_HX, payload: data };
}

export function storeTimelineHeatmap(data) {
  return { type: types.STORE_TIMELINE_HEATMAP, payload: data };
}

export function storeTimelineAttendance(data) {
  return { type: types.STORE_TIMELINE_ATTENDANCE, payload: data };
}

export function storeTimelineDwellHeatmap(data) {
  return { type: types.STORE_TIMELINE_DWELL_HEEATMAP, payload: data };
}

export function clearTimeline() {
  return { type: types.CLEAR_TIMELINE };
}
