import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import config from './config';

dayjs.extend(utc);
export const FETCH_HEARTBEAT_MS = 2000;
export const FETCH_HX_MS = 5000;
export const FETCH_TABLE_MS = 60000;
export const TRANSITION_DURATION = 600;
export const LIGHT_BLUE_CRITERIA = 33;
export const MEDIUM_BLUE_CRITERIA = 66;
export const TOTAL_PERCENTAGE = 100;
export const FIXED_CNT = 2;
export const FILTER_TYPES = ['day', 'week', 'month'];

export const BAD_CRITERIA = 0;
export const MEDIUM_CRITERIA = 40;
export const GOOD_CRITERIA = 80;

export const NORMAL_ICON_WIDTH = 16;
export const SMALL_ICON_WIDTH = 8;
export const NAV_ICON_WIDTH = 12;
export const MEDIUM_ICON_WIDTH = 12;

export const MILLISECONDS_PER_SECOND = 1000;
export const LIVE_TIME_INTERVAL = 300;
export const WEEK_TIME_INTERVAL = 86400;
export const MONTH_TIME_INTERVAL = 172800;
export const FILTER_LIVE_ID = 0;
export const FILTER_WEEK_ID = 1;
export const FILTER_MONTH_ID = 2;
export const FILTER_CALENDAR_ID = 3;
export const FILTER_TODAY_ID = 4;

// *** Colors *** //
export const LIGHT_BLUE = '#8ED6FF';
export const LIGHT_BLUE_ALPHA = '#8ED6FF40';

export const DARK_BLUE_PASTEL = '#70A5C3';
export const LIGHT_BLUE_PASTEL = '#B7D2E1';
export const WHITE = '#FFFFFF';
export const LIGHT_GRAY = '#F2F2F2';
export const TRAFFIC_RED = '#ff5656';
export const TRAFFIC_YELLOW = '#ffda56';
export const TRAFFIC_GREEN = '#5ff29a';

export const typesOfContracts = [
  'Halftime',
  'Fulltime',
  'Reduced',
  'Continuous',
];

export function getAPIURL() {
  const URL =
    process.env.NODE_ENV === 'development'
      ? config.api.development
      : config.api.production;

  const DEV_DEFAULT_PORT = 5000;
  if (process.env.NODE_ENV === 'production') {
    return URL;
  }
  return `${URL}:${config.port || DEV_DEFAULT_PORT}`;
}

export function scss(...args) {
  return args.filter((item) => item).join(' ');
}

const LAST_TWO = -2;
function pad(n) {
  const padded = `0${n}`;
  return padded.substr(LAST_TWO);
}

const MONTH_BASE = 1;
export function toLocaleISOString(date) {
  const day = [
    date.getFullYear(),
    pad(date.getMonth() + MONTH_BASE),
    pad(date.getDate()),
  ].join('-');

  const time = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(pad)
    .join(':');

  return `${day}T${time}`;
}

const MILLISECONDS = 1000;
const MINUTES = 60;
export function getStartOfTheDay() {
  const startAt = new Date();
  startAt.setHours(0, 0, 0, 0);
  const offset = startAt.getTimezoneOffset();
  const epoch = startAt.getTime() / MILLISECONDS - offset * MINUTES;
  return epoch;
}

export function appendParams(url, params) {
  let appendedUrl = url;
  const tupleMap = Object.entries(params);
  const tupleMapLen = tupleMap.length;
  if (tupleMapLen > 0) {
    appendedUrl += '?';
  }
  tupleMap.forEach(([key, value], index) => {
    if (key !== null && value !== null) {
      appendedUrl += `${key}=${value}`;
      if (index < tupleMapLen - 1) {
        appendedUrl += '&';
      }
    }
  });
  return appendedUrl;
}

export function range(number) {
  const arr = [];
  for (let i = 0; i < number; i++) {
    arr.push(i);
  }
  return arr;
}

export function isEmpty(obj) {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
}

const SQUARED = 2;
export function DistanceBetween2Points(PointA, PointB) {
  return Math.sqrt(
    (PointA[0] - PointB[0]) ** SQUARED + (PointA[1] - PointB[1]) ** SQUARED,
  );
}

export function getClassNameByPercentage(percentage) {
  let className = 'light-blue-bar';
  if (percentage > LIGHT_BLUE_CRITERIA) className = 'medium-blue-bar';
  if (percentage > MEDIUM_BLUE_CRITERIA) className = 'dark-blue-bar';
  return className;
}

export function getRequestData(activeFilter, global) {
  const calendarRange = global?.calendarRange;
  const currentTime = dayjs();
  let fromTime = 0;
  let toTime = 0;
  let timeInterval = 0;

  switch (activeFilter) {
    case FILTER_LIVE_ID:
      fromTime = Math.floor(
        currentTime.subtract('1', 'hour').valueOf() / MILLISECONDS_PER_SECOND,
      );
      toTime = Math.floor(currentTime.valueOf() / MILLISECONDS_PER_SECOND);
      timeInterval = LIVE_TIME_INTERVAL; // 5 min
      break;
    case FILTER_TODAY_ID:
      fromTime = Math.floor(
        currentTime.startOf('day').valueOf() / MILLISECONDS_PER_SECOND,
      );
      toTime = Math.floor(currentTime.valueOf() / MILLISECONDS_PER_SECOND);
      timeInterval = LIVE_TIME_INTERVAL; // 1 day
      break;
    case FILTER_WEEK_ID:
      fromTime = Math.floor(
        currentTime.subtract('7', 'day').valueOf() / MILLISECONDS_PER_SECOND,
      );
      toTime = Math.floor(currentTime.valueOf() / MILLISECONDS_PER_SECOND);
      timeInterval = WEEK_TIME_INTERVAL; // 1 day
      break;
    case FILTER_MONTH_ID:
      fromTime = Math.floor(
        currentTime.subtract('1', 'month').valueOf() / MILLISECONDS_PER_SECOND,
      );
      toTime = Math.floor(currentTime.valueOf() / MILLISECONDS_PER_SECOND);
      timeInterval = WEEK_TIME_INTERVAL; // CHANGE: 1 day, the api is rounding elements to start from the first day of the month////2 days
      break;
    case FILTER_CALENDAR_ID:
      fromTime = calendarRange.fromTime;
      toTime = Math.floor(
        dayjs(calendarRange.toTime * 1000)
          .endOf('day')
          .valueOf() / MILLISECONDS_PER_SECOND,
      );
      timeInterval = WEEK_TIME_INTERVAL; // 1 day
      break;
    default:
      fromTime = Math.floor(
        currentTime.subtract('1', 'hour').valueOf() / MILLISECONDS_PER_SECOND,
      );
      toTime = Math.floor(currentTime.valueOf() / MILLISECONDS_PER_SECOND);
      timeInterval = LIVE_TIME_INTERVAL; // 5 min
      break;
  }

  return { fromTime, toTime, timeInterval };
}

export function isArraysSame(array1, array2) {
  const _array1 = array1.map((row) =>
    JSON.stringify(row, Object.keys(row).sort()),
  );
  const _array2 = array2.map((row) =>
    JSON.stringify(row, Object.keys(row).sort()),
  );
  return (
    _array1.length === _array2.length && _array1.join(',') === _array2.join(',')
  );
}

export function isObjectsSame(object1, object2, shallow = true) {
  if (shallow) {
    return (
      JSON.stringify(object1, Object.keys(object1).sort()) ===
      JSON.stringify(object2, Object.keys(object2).sort())
    );
  }
  return JSON.stringify(object1) === JSON.stringify(object2);
}

export function formatTime(time, isSimple) {
  if (time > 3600) return 'more than an hour';
  if (time < 60) return `${time} ${time > 1 ? 'seconds' : 'second'}`;

  const mins = Math.floor(time / 60);
  const seconds = Math.trunc(time % 60);

  if (isSimple) {
    if (mins > 0) return `${mins} minutes`;
    return `${seconds} seconds`;
  }

  return `${mins} ${mins > 1 ? 'minutes' : 'minute'} and ${seconds} ${
    seconds > 1 ? 'seconds' : 'second'
  }`;
}
