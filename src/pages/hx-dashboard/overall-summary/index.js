import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import cx from 'classnames';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import LineChart from '../../../components/happiness-experience/line-chart';
import LiveHX from '../../../components/happiness-experience/live-hx';
import Summary from '../../../components/happiness-experience/summary';
import Spinner from '../../../components/shared/spinner';
import { Store } from '../../../store';
import {
  FIXED_CNT,
  FILTER_WEEK_ID,
  FILTER_MONTH_ID,
  FILTER_CALENDAR_ID,
} from '../../../utils';
import classes from './overall-summary.module.scss';

dayjs.extend(utc);

const CHART_DAY_LABEL_LENGTH = 12;
const CHART_WEEK_LABEL_LENGTH = 7;
const CHART_MONTH_LABEL_LENGTH = 15;
const DOUBLE = 2;
const MILLISECONDS_PER_SECOND = 1000;

function getSummaryValues({ timeline }) {
  let minValue = 0;
  let maxValue = 0;
  let avgValue = 0;
  let liveValue = 0;

  if (timeline && timeline.hx) {
    const hxTimeline = timeline.hx;
    const values = hxTimeline.map((row) => row.total_avg);
    minValue = values.length > 0 ? _.minBy(values) : 0;
    maxValue = values.length > 0 ? _.maxBy(values) : 0;
    avgValue =
      values.length > 0 ? Number(_.meanBy(values).toFixed(FIXED_CNT)) : 0;

    if (values.length > 0) {
      const lastHX = values.slice(-1);
      const [lastHXValue] = lastHX;
      liveValue = lastHXValue;
      if (!Number.isInteger(liveValue)) {
        liveValue = liveValue.toFixed(1);
      }
    }
  }

  return { minValue, maxValue, avgValue, liveValue };
}

function getLabels({ timeline, global, activeFilter }) {
  let labels = [];
  const values = [];

  if (timeline) {
    let hxTimeline = [];
    if (timeline.hx) hxTimeline = timeline.hx;

    let labelLength = CHART_DAY_LABEL_LENGTH;
    let timeFormatStyle = 'HH:mm';
    let intervalTimeType = 'minute';
    let intervalTime = 5;
    let intervalTimeDiff = dayjs().minute() % intervalTime;

    if (activeFilter === FILTER_WEEK_ID) {
      labelLength = CHART_WEEK_LABEL_LENGTH;
      timeFormatStyle = 'MM-DD';
      intervalTimeType = 'day';
      intervalTime = 1;
      intervalTimeDiff = 0;
    }
    if (activeFilter === FILTER_MONTH_ID) {
      labelLength = CHART_MONTH_LABEL_LENGTH;
      timeFormatStyle = 'MM-DD';
      intervalTimeType = 'day';
      intervalTime = DOUBLE;
      intervalTimeDiff = 0;
    }

    if (activeFilter === FILTER_CALENDAR_ID) {
      labelLength = FILTER_WEEK_ID;
      timeFormatStyle = 'MM-DD';
      intervalTimeType = 'day';
      intervalTime = 1;
      intervalTimeDiff = 0;
    }

    if (activeFilter !== FILTER_CALENDAR_ID) {
      for (let index = 0; index < labelLength; index++) {
        const label = dayjs()
          .subtract(intervalTime * index, intervalTimeType)
          .subtract(intervalTimeDiff, intervalTimeType)
          .format(timeFormatStyle);
        labels = [...labels, label];
      }
    } else {
      const { calendarRange } = global;
      const { fromTime, toTime } = calendarRange;
      let _toTime = dayjs(toTime * MILLISECONDS_PER_SECOND);
      while (_toTime.valueOf() >= fromTime * MILLISECONDS_PER_SECOND) {
        const label = _toTime.format(timeFormatStyle);
        labels = [...labels, label];
        _toTime = dayjs(_toTime).subtract(intervalTime, intervalTimeType);
      }
    }

    const _hxTimeline = hxTimeline.map((row) => {
      const { total_avg, time } = row;
      return {
        value: Number.isInteger(total_avg)
          ? total_avg
          : Number(total_avg.toFixed(FIXED_CNT)),
        label: dayjs(time * MILLISECONDS_PER_SECOND).format(timeFormatStyle),
      };
    });

    labels.forEach((label) => {
      const indexOfTick = _hxTimeline.findIndex((row) => row.label === label);
      if (indexOfTick !== -1) {
        values.push(_hxTimeline[indexOfTick].value);
      } else {
        values.push(null);
      }
    });
  }
  return { chartLabels: labels.reverse(), chartValues: values.reverse() };
}
function OverallSummary() {
  const [store] = useContext(Store);
  const { global, timeline } = store;
  const activeFilter = global ? global.filter.id : 0;
  const { liveValue, minValue, maxValue, avgValue } = getSummaryValues({
    timeline,
  });
  const { chartLabels, chartValues } = getLabels({
    timeline,
    global,
    activeFilter,
  });
  const loading = global?.loading;
  const hxLoading = loading?.hxTimeline;

  return (
    <BlockWrapper
      title="hx_dashabord__summary_title"
      prefix={activeFilter === 0 ? 'Today' : ''}
    >
      <div className={classes.mainWrapper}>
        <div className={classes.leftWrapper}>
          <div className={classes.liveHx}>
            <LiveHX value={liveValue} loading={hxLoading} />
          </div>
          <div className={classes.daySummary}>
            <Summary
              minValue={minValue}
              maxValue={maxValue}
              avgValue={avgValue}
              activeFilter={activeFilter}
              loading={hxLoading}
            />
          </div>
        </div>
        <div className={classes.graphWrapper}>
          <div className={classes.title}>
            <span className="text-normal">
              <FormattedMessage id="hx_dashboard__summary_chart_title" />
            </span>
          </div>
          {hxLoading ? (
            <div className={cx(classes.spinnerContainer, 'Spinner_contained')}>
              <Spinner />
            </div>
          ) : (
            <LineChart labels={chartLabels} values={chartValues} />
          )}
        </div>
      </div>
    </BlockWrapper>
  );
}

export default React.memo(OverallSummary);
