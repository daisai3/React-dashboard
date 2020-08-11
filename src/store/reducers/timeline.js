import * as types from '../types';

export default function historyReducer(state, action) {
  switch (action.type) {
    case types.STORE_TIMELINE_HX:
      return { ...state, hx: action.payload };
    case types.STORE_TIMELINE_HEATMAP:
      return { ...state, heatmap: action.payload };
    case types.STORE_TIMELINE_ATTENDANCE:
      return { ...state, attendance: action.payload };
    case types.STORE_TIMELINE_DWELL_HEEATMAP:
      return { ...state, dwellHeatmap: action.payload };
    case types.CLEAR_TIMELINE:
      return {};
    default:
      return state;
  }
}
