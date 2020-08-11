import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import classes from './notification.module.scss';
import Icon from '../icon';

const customerAttendanceThreshold = 12;
const happinessIndexThreshold = 85;

function NotificationCard({ type }) {
  const notif = {
    hxi: `Customers Happiness Average is below ${happinessIndexThreshold}%!`,
    attendance: `The amount of customers is getting high!`,
  };

  return (
    <div className={classes.notifBox}>
      <Icon name="alerts" fillRule="evenodd" clipRule="evenodd" />
      <p>{notif[type]}</p>
    </div>
  );
}

NotificationCard.propTypes = {
  type: PropTypes.string.isRequired,
};

function Notification({ center }) {
  const [customerAttendanceAlert, setCustomerAttendanceAlert] = useState(false);
  const [happinessIndexAlert, setHappinessIndexAlert] = useState(false);

  useEffect(() => {
    setCustomerAttendanceAlert(false);
    setHappinessIndexAlert(false);

    if (center.customer_list.length > customerAttendanceThreshold) {
      setCustomerAttendanceAlert(true);
    }
    const avgHXI =
      center.customer_list.reduce((acc, curr) => {
        return acc + curr.happiness_index;
      }, 0) / center.customer_list.length;
    if (avgHXI < happinessIndexThreshold) {
      setHappinessIndexAlert(true);
    }
  }, [center]);

  return (
    <>
      {!customerAttendanceAlert && !happinessIndexAlert && (
        <div className={classes.notifBox}>No new alerts!</div>
      )}
      {customerAttendanceAlert && <NotificationCard type="attendance" />}
      {happinessIndexAlert && <NotificationCard type="hxi" />}
    </>
  );
}

Notification.propTypes = {
  center: PropTypes.shape({
    customer_list: PropTypes.arrayOf(
      PropTypes.shape({ happiness_index: PropTypes.number }),
    ),
  }).isRequired,
};

export default Notification;
