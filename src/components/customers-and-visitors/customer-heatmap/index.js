import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import cx from 'classnames';
import h337 from 'heatmap.js';
import Xarrow from 'react-xarrows';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Icon from '../../shared/svgIcon';
import FloorPlanBackground from '../../shared/map-floorplan/floorplan-background';
import FloorPlanAreas from '../../shared/map-floorplan/floorplan-areas';
import Spinner from '../../shared/spinner';
import { NORMAL_ICON_WIDTH } from '../../../utils';
import { controls } from './constants';
import classes from './customer-heatmap.module.scss';

dayjs.extend(utc);

const MAP_BG_HEIGHT = 587;
const ZOOM_IN_RATIO = 1.2;
const ORIGIN_RATIO = 1;
const MAX_RATIO = 2;

function generateHeatmap({ heatmap, heatmapData, originFloorPlanHeight }) {
  const { max, values } = heatmapData;
  const _values = values.map((row) => {
    return {
      ...row,
      x: Math.floor((row.x * MAP_BG_HEIGHT) / originFloorPlanHeight),
      y: Math.floor((row.y * MAP_BG_HEIGHT) / originFloorPlanHeight),
    };
  });

  heatmap.setData({
    max,
    data: _values,
  });
}

function CustomerHeatmap({
  heatmapData,
  floorPlanInfo,
  zones,
  isDetailedMode,
  selectedZoneId,
  loading,
}) {
  const [zoomRatio, setZoomRatio] = useState(ORIGIN_RATIO);
  const [heatmap, setHeatmap] = useState(null);
  const [originFloorPlanImg, setOriginFloorPlanImg] = useState(null);
  const [originFloorPlanHeight, setOriginFloorPlanHeight] = useState(
    MAP_BG_HEIGHT,
  );
  const [originFloorPlanWidth, setOriginFloorPlanWidth] = useState(
    MAP_BG_HEIGHT,
  );
  const mapWrapperRef = useRef();
  const mapBgRef = useRef();

  useEffect(() => {
    if (originFloorPlanImg !== floorPlanInfo.img) {
      const _img = new Image();
      _img.onload = () => {
        setOriginFloorPlanWidth(_img.width);
        setOriginFloorPlanHeight(_img.height);
        setOriginFloorPlanImg(floorPlanInfo.img);
      };
      _img.src = floorPlanInfo.img;
    }
  }, [floorPlanInfo, originFloorPlanImg]);

  const createHeatmap = () => {
    return h337.create({
      container: mapBgRef.current,
      gradient: {
        '.1': 'rgba(255, 215, 4, 0.71)',
        '.3': 'rgba(255, 201, 63, 0.53)',
        '.6': 'rgba(255, 161, 19, 0.74)',
        '.8': 'rgba(255, 93, 42, 0.69)',
      },
    });
  };

  if (heatmapData && mapBgRef.current && heatmap === null) {
    setHeatmap(createHeatmap());
  }

  if (heatmap !== null) {
    generateHeatmap({
      heatmap: createHeatmap(),
      heatmapData,
      originFloorPlanHeight,
    });
  }

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

  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>
            <FormattedMessage
              id="customer_dashboard__insight_heatmap_map_title"
              defaultMessage="2D Map of customer density in center"
            />
          </span>
        </div>
        <div className={classes.content}>
          {loading && (
            <div className={cx(classes.spinnerContainer, 'Spinner_contained')}>
              <Spinner />
            </div>
          )}
          <div
            className={classes.map}
            ref={mapWrapperRef}
            style={{ display: loading ? 'none' : 'block' }}
          >
            <div
              id="map-bg"
              ref={mapBgRef}
              className={classes.mapBg}
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
            </div>
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
          <div className={classes.colorScheme}>
            <div className={cx(classes.title, 'text-normal')}>
              Heatmap Color scheme
            </div>
            <div className={classes.perspectiveBar}>
              <div className={classes.lineStart} id="line-start"></div>
              <div className={classes.lineEnd} id="line-end"></div>
              <Xarrow
                start="line-start"
                end="line-end"
                strokeWidth={1}
                headSize={8}
                color="#ffffff"
              />
            </div>
            <div className={cx(classes.barInfo, 'text-small')}>
              <span>{`Less ${
                isDetailedMode ? 'time spent' : 'density of people'
              }`}</span>
              <span>{`Most ${
                isDetailedMode ? 'time spent' : 'density of people'
              }`}</span>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

CustomerHeatmap.propTypes = {
  heatmapData: PropTypes.shape({}),
  zones: PropTypes.arrayOf(PropTypes.shape({})),
  floorPlanInfo: PropTypes.shape({
    img: PropTypes.string,
    pxPerMeter: PropTypes.number,
  }),
  selectedZoneId: PropTypes.number,
  loading: PropTypes.bool,
  isDetailedMode: PropTypes.bool,
};
CustomerHeatmap.defaultProps = {
  heatmapData: { max: 0, values: [] },
  zones: [],
  floorPlanInfo: {
    img: '',
    pxPerMeter: 0,
  },
  selectedZoneId: -1,
  loading: false,
  isDetailedMode: false,
};

export default React.memo(CustomerHeatmap);
