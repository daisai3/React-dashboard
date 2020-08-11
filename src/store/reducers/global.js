import * as types from '../types';
// filter option: 0-active, 1-last 7 days, 2-last month

export default function globalReducer(state, action) {
  switch (action.type) {
    case types.STORE_ACTIVE_FILTER:
      return { ...state, filter: { ...action.payload } };
    case types.STORE_LOADING:
      const { loading } = state;
      return { ...state, loading: { ...loading, ...action.payload } };
    case types.CLEAR_LOADING:
      return {};
    case types.STORE_CALENDAR_RANGE:
      return { ...state, calendarRange: { ...action.payload } };
    default:
      return state;
  }
}
