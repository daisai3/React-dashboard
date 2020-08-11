import * as types from '../types';

export default function centersReducer(state, action) {
  switch (action.type) {
    case types.STORE_CENTERS_WAITING_TIME:
      return { ...state, waitingTime: action.payload };
    case types.STORE_CENTERS_INFO:
      return { ...state, centerInfo: action.payload };
    case types.STORE_CENTERS_JOURNEY:
      return { ...state, journey: action.payload };
    case types.STORE_CENTERS_COMMON_JOURNEYS:
      return { ...state, commonJourneys: action.payload };
    case types.STORE_CENTERS_HAPPINESS_AREA:
      return { ...state, happinessArea: action.payload };
    case types.STORE_CENTERS_ZONES:
      return { ...state, zones: action.payload };
    case types.STORE_CENTERS_CUSTOMERS:
      return { ...state, customers: action.payload };
    case types.STORE_CENTERS_AREA_STATISTICS:
      return { ...state, areaStatistics: action.payload };
    case types.STORE_CENTERS_DWELL_STATISTICS:
      return { ...state, dwellStatistics: action.payload };
    case types.STORE_PEOPLE_WAITING_DEMOGRAPHICS:
      return { ...state, peopleWaitingDemographics: action.payload };
    case types.CLEAR_CENTERS:
      return {};
    default:
      return state;
  }
}
