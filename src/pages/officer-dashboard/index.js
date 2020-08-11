import React, { useState, useEffect, useRef, useContext } from 'react';

import { FormattedMessage } from 'react-intl';
import Icon from '../../components/shared/icon';
import JourneyStages from '../../components/journey-stages';

import centerService from '../../services/center.service';
import { scss, FETCH_HEARTBEAT_MS, getStartOfTheDay } from '../../utils';
import classes from './officer-dashboard.module.scss';

import { Store } from '../../store';
import Spinner from '../../components/shared/spinner';
import HappinessChart from '../../components/happiness-chart';
import CustomersList from '../../components/customers-list';
import CustomersMap from '../../components/customers-map';
import Notification from '../../components/shared/notification';
import FootageLine from '../../components/footage-line';

const MINUTES = 60;
const MS = 1000;

function renderTimeBlocks(avgTime) {
  let units = avgTime;
  let measure = 'Seconds';

  if (avgTime / MINUTES > 0) {
    measure = 'Minutes';
    units = avgTime / MINUTES;
  }
  return (
    <>
      <p className={classes.focusNumber}>{units.toFixed(1)}</p>
      <p>{measure}</p>
    </>
  );
}

const PERCENT = 100;

function OfficerDashboard() {
  const [store] = useContext(Store);

  const happinessChartParent = useRef();
  const happinessTitle = useRef();

  const [center, setCenter] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [parentWidth, setParentWidth] = useState();
  const [parentHeight, setParentHeight] = useState();
  const [titleHeight, setTitleHeight] = useState();

  const [toggleListOrMap, setToggleListOrMap] = useState(true);

  useEffect(() => {
    const startOfDay = getStartOfTheDay();
    centerService
      .getCenter(store.user.center_name, startOfDay, Date.now() / MS)
      .then(({ data: centerResponse }) => {
        setCenter(centerResponse);
        if (centerResponse.customer_list.length > 0) {
          setSelectedCustomer(centerResponse.customer_list[0]);
        }
        setLoading(false);
      });

    const refetchInterval = setInterval(() => {
      centerService
        .getCenter(store.user.center_name, startOfDay, Date.now() / MS)
        .then(({ data: centerResponse }) => {
          setCenter(centerResponse);
        });
    }, FETCH_HEARTBEAT_MS);

    return () => {
      clearInterval(refetchInterval);
    };
  }, [store.user.center_name]);

  useEffect(() => {
    setParentHeight(happinessChartParent.current?.clientHeight);
    setParentWidth(happinessChartParent.current?.clientWidth);
    setTitleHeight(happinessTitle.current?.clientHeight);
  }, [loading, center]);

  if (loading) {
    return (
      <div className="Spinner_layout">
        <Spinner />
      </div>
    );
  }

  return (
    <div className={classes.mainWrapper} data-testid="officer-page">
      <div className={classes.leftColumn}>
        <div className={classes.tabRow}>
          <h4>
            <FormattedMessage
              id="officer_dashboard__customer_list"
              defaultMessage="Customer's List"
            />
          </h4>
          <div>
            <button
              type="button"
              onClick={() => setToggleListOrMap(!toggleListOrMap)}
            >
              <Icon name={toggleListOrMap ? 'map' : 'list'} />
            </button>
          </div>
        </div>
        <div className={classes.customerListWrapper}>
          {toggleListOrMap ? (
            <CustomersList
              customers={center.customer_list}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
            />
          ) : (
            <CustomersMap
              map={center.floor_plan}
              customers={center.customer_list}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
            />
          )}
        </div>
        <div className={classes.generalInfo}>
          <h6>
            <FormattedMessage
              id="officer_dashboard__general_info"
              defaultMessage="General Center Information"
            />
          </h6>
          <div className={classes.blocksRow}>
            <div className={scss(classes.infoBlock, 'Global_card_wrapper')}>
              <p>
                <FormattedMessage
                  id="officer_dashboard__current_ppl_count"
                  defaultMessage="Current people count"
                />
              </p>
              <p className={classes.focusNumber}>
                {center.customer_list.length}
              </p>
              <p>
                <FormattedMessage
                  id="officer_dashboard__individuals"
                  defaultMessage="Individuals"
                />
              </p>
            </div>
            <div className={scss(classes.infoBlock, 'Global_card_wrapper')}>
              <p>
                <FormattedMessage
                  id="officer_dashboard__avg_waiting_time"
                  defaultMessage="Average waiting time"
                />
              </p>
              {renderTimeBlocks(center.avg_waiting_time)}
            </div>
            <div className={scss(classes.infoBlock, 'Global_card_wrapper')}>
              <p>
                <FormattedMessage
                  id="officer_dashboard__percent_ppl_waiting"
                  defaultMessage="Percent of people waiting"
                />
              </p>
              <p className={classes.focusNumber}>
                {(
                  (center.customer_list.reduce(
                    (acc, curr) => (curr.area === 'Waiting' ? acc + 1 : acc),
                    0,
                  ) /
                    (center.customer_list.length || 1)) *
                  PERCENT
                ).toFixed(0)}
                <span>%</span>
              </p>
              <p />
            </div>
            <div className={scss(classes.infoBlock, 'Global_card_wrapper')}>
              <p>
                <FormattedMessage
                  id="officer_dashboard__active_officers"
                  defaultMessage="Active officers on site"
                />
              </p>
              <p className={classes.focusNumber}>
                {center.employee_list.reduce(
                  (acc, officer) =>
                    officer.is_active === 'Active' ? acc + 1 : acc,
                  0,
                )}
              </p>
              <p />
            </div>
          </div>
        </div>
        <div
          className={scss('Global_card_wrapper', classes.notificationWrapper)}
        >
          <h6 style={{ margin: 0 }}>
            <FormattedMessage
              id="officer_dashboard__new_alert"
              defaultMessage="New Alert"
            />
          </h6>
          <Notification center={center} />
        </div>
      </div>
      <div className={classes.rightColumn}>
        {selectedCustomer ? (
          <>
            <div className={scss(classes.customerIdRow, 'Global_card_wrapper')}>
              <p>{selectedCustomer.global_identity}</p>
              <p>
                <FormattedMessage
                  id="officer_dashboard__last_update"
                  defaultMessage="Last update on {time}"
                  values={{ time: new Date().toLocaleTimeString() }}
                />
              </p>
            </div>
            <div
              ref={happinessChartParent}
              className={scss(classes.happinessChart, 'Global_card_wrapper')}
            >
              <h6 ref={happinessTitle} style={{ margin: 0 }}>
                <FormattedMessage
                  id="officer_dashboard__hx_graph"
                  defaultMessage="Happiness Experience Graph"
                />
              </h6>
              <HappinessChart
                center={center.name}
                selectedCustomerId={selectedCustomer.global_identity}
                height={parentHeight - titleHeight}
                width={parentWidth}
              />
            </div>
            <div className={scss(classes.zoneChart, 'Global_card_wrapper')}>
              <h6 style={{ margin: 0 }}>
                <FormattedMessage
                  id="officer_dashboard__journey_stages"
                  defaultMessage="Journey Stages"
                />
              </h6>
              <JourneyStages
                center={center.name}
                selectedCustomerId={selectedCustomer.global_identity}
              />
            </div>
            <div className={scss(classes.frameLapse, 'Global_card_wrapper')}>
              <h6 style={{ margin: 0 }}>
                <FormattedMessage
                  id="officer_dashboard__footage"
                  defaultMessage="Footage"
                />
              </h6>
              <FootageLine
                center={center.name}
                selectedCustomer={selectedCustomer.global_identity}
              />
            </div>
          </>
        ) : (
          <div
            className={classes.emptyWrapper}
            style={{ backgroundColor: 'white' }}
          >
            <FormattedMessage
              id="officer_dashboard__no_clients"
              defaultMessage="Waiting for clients!"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default OfficerDashboard;
