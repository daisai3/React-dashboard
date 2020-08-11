import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../shared/spinner';

import timelineService from '../../services/timeline.service';
import { scss } from '../../utils';
import classes from './history-chart.module.scss';
import { ScatterPlot } from '../shared/data-chart';

const HALF = 0.5;
const MILLISECONDS_IN_A_SEC = 1000;
const FIVE_MIN = 300;
const HOUR = 3600;
const HOURS_IN_A_DAY = 24;
const DAY = HOUR * HOURS_IN_A_DAY;
const DAYS_IN_A_WEEK = 7;
const WEEK = DAYS_IN_A_WEEK * DAY;
const DAYS_IN_A_MONTH = 30;
const MONTH = DAY * DAYS_IN_A_MONTH;
const MONTH_IN_A_YEAR = 12;
const YEAR = MONTH_IN_A_YEAR * MONTH;

const timeRangeToTimeFrameMapper = {
  '1h': FIVE_MIN,
  '1d': HOUR,
  '1w': HOUR,
  '1m': DAY,
  '1y': MONTH,
};

function typeYRange(data, type, dataMapper) {
  const yTopValues = {
    happiness: 100,
    attendance: Math.max(...data.map(dataMapper)),
  };
  return yTopValues[type];
}

function HistoryChart({ center, type }) {
  const [history, setHistory] = useState();
  const [tickedValue, setTickedValue] = useState('gender');
  const [timeRange, setTimeRange] = useState('1d');
  const dataChartParent = useRef(null);

  useEffect(() => {
    let start_time = Date.now();
    switch (timeRange) {
      case '1h':
        start_time -= HOUR * MILLISECONDS_IN_A_SEC;
        break;
      case '1d':
        start_time -= DAY * MILLISECONDS_IN_A_SEC;
        break;
      case '1w':
        start_time -= WEEK * MILLISECONDS_IN_A_SEC;
        break;
      case '1m':
        start_time -= MONTH * MILLISECONDS_IN_A_SEC;
        break;
      case '1y':
        start_time -= YEAR * MILLISECONDS_IN_A_SEC;
        break;
      default:
        start_time -= DAY * MILLISECONDS_IN_A_SEC;
        break;
    }
    timelineService
      .getHistory(
        center,
        type,
        start_time / MILLISECONDS_IN_A_SEC,
        Date.now() / MILLISECONDS_IN_A_SEC,
        timeRangeToTimeFrameMapper[timeRange],
      )
      .then((resp) => {
        setHistory(resp.data);
      });
  }, [center, type, timeRange]);

  const dataMapper = useCallback(
    (d) => {
      if (tickedValue === 'gender') {
        return (d.Male + d.Female) * HALF;
      }
      if (tickedValue === 'ethnicity') {
        return (d.Local + d.Nonlocal) * HALF;
      }
      return null;
    },
    [tickedValue],
  );

  return (
    <div style={{ height: '100%' }}>
      <h4>
        History for <span className="Global_text_green">{type}</span>
      </h4>
      <div className={classes.rowCentered}>
        <div className={classes.timeSelector}>
          <button
            className={timeRange === '1h' ? classes.active : ''}
            type="button"
            onClick={() => {
              setTimeRange('1h');
            }}
          >
            1h
          </button>
          <button
            className={timeRange === '1d' ? classes.active : ''}
            type="button"
            onClick={() => {
              setTimeRange('1d');
            }}
          >
            1d
          </button>
          <button
            className={timeRange === '1w' ? classes.active : ''}
            type="button"
            onClick={() => {
              setTimeRange('1w');
            }}
          >
            1w
          </button>
          <button
            className={timeRange === '1m' ? classes.active : ''}
            type="button"
            onClick={() => {
              setTimeRange('1m');
            }}
          >
            1m
          </button>
          <button
            className={timeRange === '1y' ? classes.active : ''}
            type="button"
            onClick={() => {
              setTimeRange('1y');
            }}
          >
            1y
          </button>
        </div>
      </div>

      <div className={scss(classes.rowCentered, classes.fullHeight)}>
        <div className={classes.togglesCol}>
          <button
            className={classes.toggleWrapper}
            type="button"
            onClick={() => {
              setTickedValue('gender');
            }}
          >
            Gender
            <div className={classes.wrapper}>
              <div
                className={scss(
                  classes.indicator,
                  tickedValue === 'gender' ? classes.active : '',
                )}
              />
            </div>
          </button>
          {/* <button
            className={classes.toggleWrapper}
            type="button"
            onClick={() => {
              setTickedValue('age');
            }}
          >
            Age
            <div className={classes.wrapper}>
              <div
                className={scss(
                  classes.indicator,
                  tickedValue === 'age' ? classes.active : '',
                )}
              />
            </div>
          </button> */}
          <button
            className={classes.toggleWrapper}
            type="button"
            onClick={() => {
              setTickedValue('ethnicity');
            }}
          >
            Ethnicity
            <div className={classes.wrapper}>
              <div
                className={scss(
                  classes.indicator,
                  tickedValue === 'ethnicity' ? classes.active : '',
                )}
              />
            </div>
          </button>
        </div>
        <div ref={dataChartParent} style={{ width: '100%' }}>
          {!history ? (
            <div className="Spinner_contained">
              <Spinner />
            </div>
          ) : (
            <ScatterPlot
              valueOfX={(d) => d.time}
              valueOfY={dataMapper}
              xAxisValues={history.map((d) => d.time)}
              yAxisRange={[0, typeYRange(history, type, dataMapper)]}
              data={history}
              parentHeight={dataChartParent.current?.clientHeight}
              parentWidth={dataChartParent.current?.clientWidth}
            />
          )}
        </div>
      </div>
    </div>
  );
}

HistoryChart.propTypes = {
  center: PropTypes.string,
  type: PropTypes.string,
};

export default React.memo(HistoryChart);
