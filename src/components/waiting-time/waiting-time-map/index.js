import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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
} from '../../../utils';
import { helpers, controls } from './constants';
import classes from './waiting-time-map.module.scss';

dayjs.extend(utc);

const MAP_BG_HEIGHT = 530;
const ZOOM_IN_RATIO = 1.2;
const ORIGIN_RATIO = 1;
const MAX_RATIO = 2.5;
const WAIT_SHORT_TIME = 120;
const WAIT_LONG_TIME = 300;
const ORIGIN_INDICATOR_WIDTH = 36;

function getWaitingTimeList({ zones, height, originHeight }) {
  let waitingTimeList = [];
  zones.map((zone, index) => {
    const { polygon } = zone;
    let minPx = 0;
    let maxPx = 0;
    let minPy = 0;
    let maxPy = 0;
    if (polygon) {
      polygon.map((coord, index) => {
        const px = (coord[0] / originHeight) * height;
        const py = (coord[1] / originHeight) * height;
        if (index === 0) {
          minPx = px;
          maxPx = px;
          minPy = py;
          maxPy = py;
        } else {
          if (minPx > px) minPx = px;
          if (maxPx < px) maxPx = px;
          if (minPy > py) minPy = py;
          if (maxPy < py) maxPy = py;
        }
        return coord;
      });
    }

    waitingTimeList = [
      ...waitingTimeList,
      {
        id: index,
        ...zone,
        px: (minPx + maxPx) / 2 - 18,
        py: (minPy + maxPy) / 2 - 18,
      },
    ];
    return zone;
  });

  return waitingTimeList;
}

function getWaitingTimeStatus(value) {
  if (value >= WAIT_LONG_TIME) return 'wait-long';
  if (value >= WAIT_SHORT_TIME) return 'wait-short';
  return 'new';
}

function WaitingTimeMap({ floorPlanInfo, zones, loading }) {
  const [openedZoneId, setOpenedZoneId] = useState(-1);
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

  const onToggleZone = (index) => {
    if ((openedZoneId === index) === -1) return;
    if (openedZoneId === index) setOpenedZoneId(-1);
    else setOpenedZoneId(index);
  };

  const renderZoneDetails = ({ data }) => {
    return (
      <div className={classes.tooltip}>
        <div className={classes.tooltipContent}>
          <div
            className={cx(
              classes.status,
              classes[`status-${getWaitingTimeStatus(data)}`],
            )}
          >
            <Icon name="singleEllipse" width={SMALL_ICON_WIDTH} />
          </div>
          <div className={classes.waitingTime}>
            <div className={cx(classes.value, 'text-normal')}>{data.dwell}</div>
            <div className={cx(classes.unit, 'text-smaller')}>minutes</div>
          </div>
          <div className={cx(classes.label, 'text-smaller')}>
            {data.area_type === 'waiting'
              ? 'Avg. Waiting time'
              : 'Avg, Time spent'}
          </div>
          <div className={cx(classes.people, 'text-smaller')}>
            {data.people} people waiting
          </div>
        </div>
      </div>
    );
  };

  const waitingTimeList = getWaitingTimeList({
    zones,
    height: MAP_BG_HEIGHT,
    originHeight: originFloorPlanHeight,
  });

  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
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
                isText
                zoneTooltipShowed={true}
              />
              {imgLoaded && (
                <ClickAwayListener onClickAway={() => onToggleZone(-1)}>
                  <div className={classes.indicators}>
                    <TransitionGroup>
                      {waitingTimeList.map((row) => {
                        const waitingTimeStatus = getWaitingTimeStatus(row);
                        return (
                          <CSSTransition
                            key={row.id}
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
                              onMouseEnter={() => onToggleZone(row.id)}
                              onMouseLeave={() => onToggleZone(-1)}
                            >
                              <div className={classes.indicatorBackground} />
                              <div className={classes.indicator}>
                                <div className={classes.icon}>
                                  <Icon
                                    name="waiting"
                                    width={NORMAL_ICON_WIDTH}
                                  />
                                </div>
                                <div
                                  className={cx(
                                    classes.status,
                                    classes[`status-${waitingTimeStatus}`],
                                  )}
                                >
                                  <Icon
                                    name="singleEllipse"
                                    width={SMALL_ICON_WIDTH}
                                  />
                                </div>
                              </div>
                              {openedZoneId === row.id &&
                                renderZoneDetails({
                                  data: row,
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
              {helpers.map((row) => (
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
          </SectionWrapper>
        </div>
      </SectionWrapper>
    </div>
  );
}

WaitingTimeMap.propTypes = {
  zones: PropTypes.arrayOf(PropTypes.shape({})),
  floorPlanInfo: PropTypes.shape({
    img: PropTypes.string,
    pxPerMeter: PropTypes.number,
  }),
  loading: PropTypes.bool,
};
WaitingTimeMap.defaultProps = {
  zones: [],
  floorPlanInfo: {
    img: '',
    pxPerMeter: 0,
  },
  loading: false,
};

export default React.memo(WaitingTimeMap);
