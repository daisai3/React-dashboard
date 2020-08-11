import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { DayPickerSingleDateController } from 'react-dates';
import Icon from '../svgIcon';
import Input from '../custom-input';
import { NORMAL_ICON_WIDTH, NAV_ICON_WIDTH } from '../../../utils';
import classes from './calendar.module.scss';

function Calendar({ calendarRange, onApply, onClose }) {
  const today = moment();
  const [dateRange, setDateRange] = useState({
    from: today.format('DD/MM/YYYY'),
    to: today.format('DD/MM/YYYY'),
  });
  const [focusedInput, setFocusedInput] = useState('from');

  const { from, to } = dateRange;
  const momentFrom = moment(from, 'DD/MM/YYYY', true);
  const momentTo = moment(to, 'DD/MM/YYYY', true);
  const { _isValid: isFromValid } = momentFrom;
  const { _isValid: isToValid } = momentTo;
  const isToisBeforeFrom = moment(momentTo).isBefore(momentFrom);

  useEffect(() => {
    setDateRange(calendarRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setDateRange(calendarRange);
  }, [calendarRange]);

  const onChangeInput = (event) => {
    const {
      target: { name, value },
    } = event;
    setDateRange({ ...dateRange, [name]: value });
  };

  const onFocusInput = (event) => {
    const {
      target: { name },
    } = event;
    setFocusedInput(name);
  };

  const onChangeCalendarDate = (day) => {
    if (
      isFromValid &&
      focusedInput === 'to' &&
      moment(day).isBefore(momentFrom)
    ) {
      return;
    }
    setDateRange({
      ...dateRange,
      [focusedInput]: moment(day).format('DD/MM/YYYY'),
    });
  };

  const onApplyFilter = () => {
    if (isFromValid && isToValid) onApply(dateRange);
  };

  const getCalendarDate = () => {
    let calendarDate = null;
    if (isToValid && (isToisBeforeFrom || moment(momentTo).isAfter(today)))
      return calendarDate;
    if (isFromValid && moment(momentFrom).isAfter(today)) return calendarDate;
    if (focusedInput === 'from' && from !== null) calendarDate = momentFrom;
    if (focusedInput === 'to' && to !== null) calendarDate = momentTo;
    return calendarDate;
  };

  return (
    <div className={classes.mainWrapper}>
      <div className={cx(classes.header)}>
        <div className={cx(classes.title)}>
          <span className={classes.indicatorIcon}>
            <Icon name="filters" width={NORMAL_ICON_WIDTH} />
          </span>
          <span className={cx(classes.text, 'text-normal')}>
            <FormattedMessage
              id="calendar_filter_title"
              defaultMessage="Select a specific period of time"
            />
          </span>
        </div>
        <div className={classes.action}>
          <button type="button" onClick={onClose}>
            <span className={classes.closeIcon}>
              <Icon name="close" width={24} />
            </span>
          </button>
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.inputsWrapper}>
          <div
            className={cx(
              classes.inputWrapper,
              focusedInput === 'from' ? classes.focusedInputWrapper : '',
              (!isFromValid && from !== null) ||
                moment(momentFrom).isAfter(today)
                ? classes.invalidInputWrapper
                : '',
            )}
          >
            <Input
              label="From"
              name="from"
              value={from || ''}
              autoFocus
              placeholder="DD/MM/YYYY"
              onChange={onChangeInput}
              onFocus={onFocusInput}
            />
          </div>
          <div
            className={cx(
              classes.inputWrapper,
              focusedInput === 'to' ? classes.focusedInputWrapper : '',
              (!isToValid && to !== null) ||
                (isToisBeforeFrom && to !== null) ||
                moment(momentTo).isAfter(today)
                ? classes.invalidInputWrapper
                : '',
            )}
          >
            <Input
              label="To"
              name="to"
              value={to || ''}
              placeholder="DD/MM/YYYY"
              onChange={onChangeInput}
              onFocus={onFocusInput}
            />
          </div>
        </div>
        <div className={classes.calendarWrapper}>
          <DayPickerSingleDateController
            date={getCalendarDate()}
            onDateChange={(day) => onChangeCalendarDate(day)}
            daySize={48}
            noBorder
            firstDayOfWeek={1}
            weekDayFormat="ddd"
            horizontalMonthPadding={0}
            navPrev={<Icon name="arrow" width={NAV_ICON_WIDTH} />}
            navNext={<Icon name="arrow" width={NAV_ICON_WIDTH} />}
            isOutsideRange={(day) => {
              return (
                day.isAfter(today) ||
                (focusedInput === 'to' && day.isBefore(momentFrom))
              );
            }}
          />
        </div>
      </div>
      <div className={classes.footer}>
        <button
          type="button"
          className={classes.applyBtn}
          onClick={onApplyFilter}
          disabled={
            !isFromValid ||
            !isToValid ||
            isToisBeforeFrom ||
            momentFrom.isAfter(today) ||
            momentTo.isAfter(today)
          }
        >
          <span className={cx(classes.value, 'text-normal')}>
            <FormattedMessage
              id="calendar_filter_apply_btn_text"
              defaultMessage="Apply filters"
            />
          </span>
        </button>
      </div>
    </div>
  );
}

Calendar.propTypes = {
  onApply: PropTypes.func,
  onClose: PropTypes.func,
};
Calendar.defaultProps = { onApply: () => {}, onClose: () => {} };

export default React.memo(Calendar);
