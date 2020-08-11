import React, { useState, useEffect, useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import centerService from '../../services/center.service';
import { FETCH_HEARTBEAT_MS, scss, getStartOfTheDay } from '../../utils';
import { Store } from '../../store/index';
import Spinner from '../../components/shared/spinner';

import classes from './center-dashboard.module.scss';
import EmployeeCard from '../../components/employee-card';
import Icon from '../../components/shared/icon';
import { HalfDonut } from '../../components/shared/data-chart';
import BarChartGroup from '../../components/bar-chart-group';
import Notification from '../../components/shared/notification';
import Button from '../../components/shared/button';
import HistoryChart from '../../components/history-chart';

const MS = 1000;
const MINUTES = 60;
function renderTimeBlocks(avgTime) {
  let units = avgTime;
  let measure = 'Seconds';

  if (avgTime / MINUTES > 0) {
    measure = 'Minutes';
    units = avgTime / MINUTES;
  }
  return (
    <>
      <p className={classes.focusNumber}>{units?.toFixed(1)}</p>
      <p>{measure}</p>
    </>
  );
}

function CenterDashboard() {
  const [store] = useContext(Store);

  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState();
  const [happinessIndexAvg, setHappinessIndexAvg] = useState(0);
  const [HXmap, setHXMap] = useState({});
  const [attendanceMap, setAttendanceMap] = useState({});
  const [historyType, setHistoryType] = useState();

  const donutParent = useRef();

  function fillInMaps(customers) {
    const attendanceMapTmp = {};
    const hxMapTmp = {};
    customers.forEach((customer) => {
      // Attendance mapping
      attendanceMapTmp[customer.area] = attendanceMapTmp[customer.area]
        ? attendanceMapTmp[customer.area] + 1
        : 1;

      // HX mapping
      hxMapTmp[customer.area] = hxMapTmp[customer.area]
        ? hxMapTmp[customer.area] + customer.happiness_index
        : customer.happiness_index;
    });

    const sumHxOfCustomers = customers.reduce(
      (acc, curr) => acc + curr.happiness_index,
      0,
    );

    let avgHappinessIndex = 0;
    if (customers.length !== 0) {
      avgHappinessIndex = sumHxOfCustomers / customers.length;
    }

    Object.keys(hxMapTmp).forEach((key) => {
      hxMapTmp[key] = (
        hxMapTmp[key] / attendanceMapTmp[key] -
        avgHappinessIndex
      )?.toFixed(0);
    });

    return [attendanceMapTmp, hxMapTmp, avgHappinessIndex];
  }

  useEffect(() => {
    function heartbeatFetchCenter() {
      const startOfDay = getStartOfTheDay();
      centerService
        .getCenter(store.user.center_name, startOfDay, Date.now() / MS)
        .then(({ data: centerResponse }) => {
          const customers = centerResponse.customer_list;
          const [attendanceMapTmp, hxMapTmp, avgHappinessIndex] = fillInMaps(
            customers,
          );
          setHappinessIndexAvg(avgHappinessIndex);
          setCenter(centerResponse);
          setAttendanceMap(attendanceMapTmp);
          setHXMap(hxMapTmp);
          setLoading(false);
        });
    }

    heartbeatFetchCenter();
    const refetchInterval = setInterval(() => {
      heartbeatFetchCenter();
    }, FETCH_HEARTBEAT_MS);

    return () => {
      clearInterval(refetchInterval);
    };
  }, [store.user.center_name]);

  if (loading) {
    return (
      <div className="Spinner_layout">
        <Spinner />
      </div>
    );
  }

  function renderStats(valuesMap, usePercentages) {
    return (
      <div className={classes.mapContainer}>
        {Object.keys(valuesMap).map((key) => (
          <div className={classes.mapItem} key={key}>
            <span>{key}</span>
            {usePercentages ? (
              <span
                className={scss(
                  valuesMap[key] < 0 ? 'Global_text_red' : 'Global_text_green',
                  'Global_bold',
                )}
              >{`${valuesMap[key]}%`}</span>
            ) : (
              <span>{valuesMap[key]}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={classes.mainWrapper} data-testid="center-manager-page">
      <div className={classes.graphsWrapper}>
        <div className={classes.topCategories}>
          <div
            className={scss(
              'Global_card_wrapper',
              'Global_pb24',
              'Global_p10',
              'Global_relative',
            )}
          >
            <p>
              <FormattedMessage
                id="center_dashboard__hx_meter"
                defaultMessage="Happiness Experience Meter"
              />
            </p>
            <div className={classes.topBox} ref={donutParent}>
              <HalfDonut
                value={happinessIndexAvg}
                text={String(happinessIndexAvg)}
                height={donutParent.current?.clientHeight}
                width={donutParent.current?.clientWidth}
              />
            </div>
            {renderStats(HXmap, true)}
            <Button
              icon
              type={historyType === 'happiness' ? 'primary' : 'info'}
              onClick={() => {
                setHistoryType((type) =>
                  type === 'happiness' ? undefined : 'happiness',
                );
              }}
              className={classes.centeredBtn}
            >
              Show History
            </Button>
          </div>
          <div
            className={scss(
              'Global_card_wrapper',
              'Global_pb24',
              'Global_p10',
              'Global_relative',
            )}
          >
            <p>
              <FormattedMessage
                id="center_dashboard__customer_attendance"
                defaultMessage="Customer Attendance"
              />
            </p>
            <div className={scss(classes.topBox, classes.columnCentered)}>
              <p className={classes.mainNumber}>
                {center.customer_list.length}
              </p>
              <p>
                <FormattedMessage
                  id="center_dashboard__customer"
                  defaultMessage="customers"
                />
              </p>
            </div>
            {renderStats(attendanceMap)}
            <Button
              icon
              type={historyType === 'attendance' ? 'primary' : 'info'}
              onClick={() => {
                setHistoryType((type) =>
                  type === 'attendance' ? undefined : 'attendance',
                );
              }}
              className={classes.centeredBtn}
            >
              Show History
            </Button>
          </div>
          <div
            className={scss(
              'Global_card_wrapper',
              'Global_pb24',
              'Global_p10',
              'Global_relative',
            )}
          >
            <p>
              <FormattedMessage
                id="center_dashboard__avg_waiting_time"
                defaultMessage="Average Waiting Time"
              />
            </p>
            <div className={classes.waitingTimeContainer}>
              {renderTimeBlocks(center.avg_waiting_time)}
            </div>
          </div>
        </div>
        <div className={classes.graphsContainer}>
          {!historyType ? (
            <>
              <p>
                <FormattedMessage
                  id="center_dashboard__data_for_center_name"
                  defaultMessage={'Customers currently in {center}'}
                  values={{
                    center: (
                      <span className="Global_text_green Global_bold">
                        {center.name}
                      </span>
                    ),
                  }}
                />
              </p>
              <BarChartGroup customers={center.customer_list} />
            </>
          ) : (
            <HistoryChart type={historyType} center={center.name} />
          )}
        </div>
        <div className={classes.notifContainer}>
          <p>
            <FormattedMessage
              id="center_dashboard_notification_title"
              defaultMessage="Notifications"
            />
          </p>
          <Notification center={center} />
        </div>
      </div>
      <div className={classes.officerColumn}>
        <div className={classes.officerCounter}>
          <Icon name="officers" fillRule="evenodd" clipRule="evenodd" />
          <FormattedMessage
            id="center_dashboard__active_employees"
            defaultMessage="Active employees: {amount}"
            values={{
              amount: (
                <span style={{ color: 'blue', fontWeight: 500 }}>
                  {
                    center.employee_list.filter(
                      (employee) => employee.is_active === 'Active',
                    ).length
                  }
                </span>
              ),
            }}
          />
        </div>
        {center.employee_list
          .sort((a, b) => {
            if (a.is_active === 'Active') {
              return -1;
            }
            if (b.is_active === 'Active') {
              return 1;
            }
            return 0;
          })
          .map((employee) => (
            <EmployeeCard key={employee.email} employee={employee} />
          ))}
      </div>
    </div>
  );
}

export default CenterDashboard;
