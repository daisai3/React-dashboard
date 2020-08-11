import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Icon from '../svgIcon';
import CalendarModal from '../calendar';
import { Store } from '../../../store';
import { storeCalendarRange } from '../../../store/actions/global';
import {
  FILTER_CALENDAR_ID,
  NORMAL_ICON_WIDTH,
  SMALL_ICON_WIDTH,
} from '../../../utils';
import classes from './filter.module.scss';

const originTabs = [
  { id: 0, name: 'Live', value: 0 },
  { id: 1, name: 'Last 7 days', value: 1 },
  { id: 2, name: 'Last month', value: 2 },
];

const expandedTabs = [
  { id: 0, name: 'Live', value: 0 },
  { id: 4, name: 'Today', value: 4 },
  { id: 1, name: 'Last 7 days', value: 1 },
  { id: 2, name: 'Last month', value: 2 },
];

function Filter({
  activeOption,
  isGoback,
  isMinimized,
  isTodayTab,
  setActiveFilterOption,
  onBack,
}) {
  const [calendarOpened, setCalendarOpened] = useState(false);
  const [calendarRange, setCalendarRange] = useState({
    from: null,
    to: null,
  });
  // eslint-disable-next-line
  const [_, dispatch] = useContext(Store);
  const tabs = isTodayTab ? expandedTabs : originTabs;

  const toggleCalendar = () => {
    setCalendarOpened(!calendarOpened);
  };

  const onApplyCalendarFilter = (dateRange) => {
    const { from, to } = dateRange;
    setCalendarRange(dateRange);

    if (from && to) {
      const fromTime = moment(from, 'DD/MM/YYYY', true).unix();
      const toTime = moment(to, 'DD/MM/YYYY', true).unix();
      dispatch(storeCalendarRange({ fromTime, toTime }));
      setActiveFilterOption(FILTER_CALENDAR_ID);
    }

    setCalendarOpened(false);
  };

  const onRemoveCalenarFilter = (e) => {
    e.stopPropagation();
    setCalendarRange({ from: null, to: null });
    dispatch(storeCalendarRange({ startTime: null, toTime: null }));
    setActiveFilterOption(0);
  };

  const onCloseFilter = () => {
    setCalendarOpened(false);
  };

  const onChangeActiveFilter = (value) => {
    setCalendarRange({ from: null, to: null });
    dispatch(storeCalendarRange({ startTime: null, toTime: null }));
    setActiveFilterOption(value);
  };

  const onGoBack = () => {
    onBack(isMinimized);
  };

  return (
    <div className={classes.filterContainer}>
      {isGoback && (
        <div className={classes.btnWrapper}>
          <button
            className={cx(classes.toogleBtn, classes.backBtn)}
            type="button"
            onClick={onGoBack}
          >
            <span className={classes.icon}>
              <Icon name="arrow" width={NORMAL_ICON_WIDTH} />
            </span>
            <span className={classes.label}>Go back</span>
          </button>
        </div>
      )}
      {!isMinimized &&
        tabs.map((tab) => {
          return (
            <button
              key={tab.id}
              type="button"
              className={cx(
                classes.filterOption,
                activeOption === tab.value ? classes.active : '',
              )}
              onClick={() => onChangeActiveFilter(tab.value)}
            >
              {activeOption === 0 && tab.value === 0 && (
                <span className={classes.indicator}>
                  <Icon name="singleEllipse" width={SMALL_ICON_WIDTH} />
                </span>
              )}
              <span className={cx(classes.text, 'text-large')}>{tab.name}</span>
            </button>
          );
        })}
      {!isMinimized && (
        <ClickAwayListener onClickAway={onCloseFilter}>
          <div className={classes.calendarFilterWrapper}>
            <div className={classes.btnWrapper}>
              <button
                className={cx(
                  classes.toogleBtn,
                  classes.calendarBtn,
                  activeOption === FILTER_CALENDAR_ID
                    ? classes.activeCalendarBtn
                    : '',
                )}
                type="button"
                onClick={toggleCalendar}
              >
                <span className={classes.label}>Filter by</span>
                {activeOption !== FILTER_CALENDAR_ID ? (
                  <Icon name="filters" width={NORMAL_ICON_WIDTH} />
                ) : (
                  <span onClick={onRemoveCalenarFilter}>
                    <Icon name="close" width={NORMAL_ICON_WIDTH} />
                  </span>
                )}
              </button>
            </div>
            {calendarOpened && (
              <div className={classes.calendarFilter}>
                <CalendarModal
                  calendarRange={calendarRange}
                  onApply={onApplyCalendarFilter}
                  onClose={toggleCalendar}
                />
              </div>
            )}
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
}

Filter.propTypes = {
  activeOption: PropTypes.number,
  isGoback: PropTypes.bool,
  isMinimized: PropTypes.bool,
  isTodayTab: PropTypes.bool,
  setActiveFilterOption: PropTypes.func,
  onBack: PropTypes.func,
};
Filter.defaultProps = {
  activeOption: 0,
  isGoback: false,
  isMinimized: false,
  isTodayTab: false,
  setActiveFilterOption: () => {},
  onBack: () => {},
};

export default React.memo(Filter);
