import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import cx from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Icon from '../../shared/svgIcon';
import FloorPlanBackground from '../../shared/map-floorplan/floorplan-background';
import FloorPlanAreas from '../../shared/map-floorplan/floorplan-areas';
import Spinner from '../../shared/spinner';
import {
  NORMAL_ICON_WIDTH,
  SMALL_ICON_WIDTH,
  FETCH_HX_MS,
  formatTime,
} from '../../../utils';
import { helpers1, helpers2, controls } from './constants';
import classes from './customer-map.module.scss';

dayjs.extend(utc);

// const map_BG_WIDTH = 739;
// const MAP_BG_HEIGHT = 530;

const MAP_BG_HEIGHT = 530;
const ZOOM_IN_RATIO = 1.2;
const ORIGIN_RATIO = 1;
const MAX_RATIO = 2.5;
const WAIT_SHORT_TIME = 120;
const WAIT_LONG_TIME = 300;
const ORIGIN_INDICATOR_WIDTH = 36;

function getCustomerList({ originFloorPlanHeight, customers }) {
  return customers.map((row, index) => {
    return {
      ...row,
      id: index,
      gender: row.gender ? row.gender : 'Male',
      icon: row.gender ? row.gender.toLowerCase() : 'male',
      px: (row.position_x * MAP_BG_HEIGHT) / originFloorPlanHeight,
      py: (row.position_y * MAP_BG_HEIGHT) / originFloorPlanHeight,
    };
  });
}

function getCustomerStatus(customer) {
  let status = '';

  const { dwell_time: dwellTime } = customer;
  if (dwellTime < WAIT_SHORT_TIME) status = 'new';
  if (dwellTime >= WAIT_SHORT_TIME && dwellTime <= WAIT_LONG_TIME)
    status = 'wait-short';
  if (dwellTime > WAIT_LONG_TIME) status = 'wait-long';
  return status;
}

function CustomerMap({
  customers,
  floorPlanInfo,
  zones,
  selectedZoneId,
  loading,
  onSelectCustomer,
}) {
  const [openedCustomerId, setOpenedCustomerId] = useState(-1);
  const [zoomRatio, setZoomRatio] = useState(ORIGIN_RATIO);
  const [originFloorPlanImg, setOriginFloorPlanImg] = useState(null);
  const [originFloorPlanHeight, setOriginFloorPlanHeight] = useState(
    MAP_BG_HEIGHT,
  );
  const [originFloorPlanWidth, setOriginFloorPlanWidth] = useState(
    MAP_BG_HEIGHT,
  );

  const [imgLoaded, setImgLoaded] = useState(false);
  const mapWrapperRef = useRef();

  useEffect(() => {
    if (originFloorPlanImg !== floorPlanInfo.img) {
      const _img = new Image();
      _img.onload = () => {
        setOriginFloorPlanWidth(_img.width);
        setOriginFloorPlanHeight(_img.height);
        setOriginFloorPlanImg(floorPlanInfo.img);
        if (!imgLoaded) setImgLoaded(true);
      };
      _img.src = floorPlanInfo.img;
    }
  }, [floorPlanInfo, imgLoaded, originFloorPlanImg]);

  const onClickControl = (type) => {
    const {
      current: { offsetWidth: fitWidth },
    } = mapWrapperRef;
    switch (type) {
      case 'zoom-in':
        if (zoomRatio > MAX_RATIO) return;
        setZoomRatio(zoomRatio * ZOOM_IN_RATIO);
        break;
      case 'zoom-out':
        if (zoomRatio <= ORIGIN_RATIO) return;
        setZoomRatio(zoomRatio / ZOOM_IN_RATIO);
        break;
      case 'see-all':
        setZoomRatio(Math.floor(fitWidth / MAP_BG_HEIGHT));
        break;
      default:
        break;
    }
  };

  const onToggleCustomer = (index) => {
    if ((openedCustomerId === index) === -1) return;
    if (openedCustomerId === index) setOpenedCustomerId(-1);
    else setOpenedCustomerId(index);
  };

  const onShowCustomerHistory = (data) => {
    onSelectCustomer(data, true);
  };

  const renderCustomerDetails = ({ data, status }) => {
    return (
      <div className={classes.customerDetails}>
        <div className={classes.customerDetailsHeader}>
          <div className={classes.customerDetailsIconWrapper}>
            <div className={classes.icon}>
              <Icon name={data.icon} width={NORMAL_ICON_WIDTH} />
            </div>
            <div className={cx(classes.status, classes[`status-${status}`])}>
              <Icon name="singleEllipse" width={SMALL_ICON_WIDTH} />
            </div>
          </div>
          <div className={cx(classes.customerDetailsHeaderInfo, 'text-small')}>
            <div
              className={classes.customerAreaType}
            >{`Customer ${data.area_type}`}</div>
            <div>
              <span
                className={classes.customerId}
              >{`ID: ${data.global_identity} - `}</span>
              <span className={classes.customerHistoryLink}>
                <button
                  type="button"
                  onClick={() => onShowCustomerHistory(data)}
                >
                  see history
                </button>
              </span>
            </div>
          </div>
          <div
            className={classes.customerDetailsHeaderClose}
            onClick={() => onToggleCustomer(-1)}
          >
            <Icon name="close" width={NORMAL_ICON_WIDTH} />
          </div>
        </div>
        <div className={cx(classes.customerDetailsContent, 'text-small')}>
          {data.dwell_time > 0 && (
            <div className={classes.customerDetailRow}>
              <span className={classes.field}>Time Waiting:</span>
              <span className={classes.value}>
                {formatTime(data.dwell_time)}
              </span>
            </div>
          )}
          <div className={classes.customerDetailRow}>
            <span className={classes.field}>Area:</span>
            <span className={classes.value}>{data.area}</span>
          </div>
          <div className={classes.customerDetailRow}>
            <span className={classes.field}>Wearing mask:</span>
            <span className={classes.value}>
              {data.mask === 'Mask' ? 'Yes' : 'No'}
            </span>
          </div>
          <div className={classes.customerDetailRow}>
            <span className={classes.field}>Live HX:</span>
            <span className={classes.value}>{data.happiness_index}</span>
          </div>
        </div>
      </div>
    );
  };

  const customerList = getCustomerList({
    originFloorPlanHeight,
    customers,
  });

  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>
            <FormattedMessage
              id="customer_dashboard__insight_customer_map_title"
              defaultMessage="Current Customers in Center"
            />
          </span>
        </div>
        <div className={classes.content}>
          {loading ? (
            <div className={cx(classes.spinnerContainer, 'Spinner_contained')}>
              <Spinner />
            </div>
          ) : (
            <div
              className={classes.map}
              ref={mapWrapperRef}
              style={{
                transform: `scale(${zoomRatio})`,
              }}
            >
              <FloorPlanBackground
                src={floorPlanInfo.img}
                height={MAP_BG_HEIGHT}
              />
              <FloorPlanAreas
                height={MAP_BG_HEIGHT}
                originWidth={originFloorPlanWidth}
                originHeight={originFloorPlanHeight}
                zones={zones}
                selectedZoneId={selectedZoneId}
                isText
              />
              {imgLoaded && (
                <ClickAwayListener onClickAway={() => onToggleCustomer(-1)}>
                  <div className={classes.indicators}>
                    <TransitionGroup>
                      {customerList.map((row) => {
                        const customerStatus = getCustomerStatus(row);
                        return (
                          <CSSTransition
                            key={row.global_identity}
                            timeout={1000}
                            classNames="customer_dot"
                            appear
                          >
                            <div
                              className={classes.indicatorWrapper}
                              key={row.id}
                              style={{
                                top: row.py,
                                left: row.px,
                                width: ORIGIN_INDICATOR_WIDTH,
                                height: ORIGIN_INDICATOR_WIDTH,
                                transition: `top ${FETCH_HX_MS}ms cubic-bezier(0, 0, 1, 1), bottom ${FETCH_HX_MS}ms cubic-bezier(0, 0, 1, 1), left ${FETCH_HX_MS}ms cubic-bezier(0, 0, 1, 1), right ${FETCH_HX_MS}ms cubic-bezier(0, 0, 1, 1)`,
                              }}
                              onClick={() => onToggleCustomer(row.id)}
                            >
                              <div className={classes.indicatorBackground} />
                              <div className={classes.indicator}>
                                <div className={classes.icon}>
                                  <Icon
                                    name={row.icon}
                                    width={NORMAL_ICON_WIDTH}
                                  />
                                </div>
                                <div
                                  className={cx(
                                    classes.status,
                                    classes[`status-${customerStatus}`],
                                  )}
                                >
                                  <Icon
                                    name="singleEllipse"
                                    width={SMALL_ICON_WIDTH}
                                  />
                                </div>
                              </div>
                              {openedCustomerId === row.id &&
                                renderCustomerDetails({
                                  data: row,
                                  status: customerStatus,
                                })}
                            </div>
                          </CSSTransition>
                        );
                      })}
                    </TransitionGroup>
                  </div>
                </ClickAwayListener>
              )}
            </div>
          )}
        </div>
        <div className={classes.controls}>
          {controls.map((control) => (
            <button
              type="button"
              className={classes.control}
              key={control.id}
              onClick={() => onClickControl(control.type)}
            >
              <Icon name={control.icon} width={NORMAL_ICON_WIDTH} />
            </button>
          ))}
        </div>
        <div className={classes.footer}>
          <SectionWrapper>
            <div className={classes.helpers}>
              {helpers1.map((row) => (
                <div key={row.id} className={classes.status}>
                  <span
                    className={cx(classes.icon, classes[`icon-${row.name}`])}
                  >
                    <Icon name={row.icon} width={SMALL_ICON_WIDTH} />
                  </span>
                  <span className={cx(classes.name, 'text-smaller')}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
            <div className={cx(classes.helpers, classes.helpersPeople)}>
              {helpers2.map((row) => (
                <div key={row.id} className={classes.status}>
                  <span
                    className={cx(classes.icon, classes[`icon-${row.name}`])}
                  >
                    <Icon name={row.icon} width={NORMAL_ICON_WIDTH} />
                  </span>
                  <span className={cx(classes.name, 'text-smaller')}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </SectionWrapper>
    </div>
  );
}

CustomerMap.propTypes = {
  customers: PropTypes.arrayOf(PropTypes.shape({})),
  zones: PropTypes.arrayOf(PropTypes.shape({})),
  floorPlanInfo: PropTypes.shape({
    img: PropTypes.string,
    pxPerMeter: PropTypes.number,
  }),
  selectedZoneId: PropTypes.number,
  loading: PropTypes.bool,
  onSelectCustomer: PropTypes.func,
};
CustomerMap.defaultProps = {
  customers: [],
  zones: [],
  floorPlanInfo: {
    img: '',
    pxPerMeter: 0,
  },
  selectedZoneId: -1,
  loading: false,
  onSelectCustomer: () => {},
};

export default React.memo(CustomerMap);
