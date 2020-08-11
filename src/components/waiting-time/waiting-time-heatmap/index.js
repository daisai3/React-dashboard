import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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
import classes from './waiting-time-heatmap.module.scss';

dayjs.extend(utc);

const MAP_BG_HEIGHT = 587;
const ZOOM_IN_RATIO = 1.2;
const ORIGIN_RATIO = 1;
const MAX_RATIO = 2;

function generateHeatmap({ heatmap, heatmapData, originFloorPlanHeight }) {
  const { max, values } = heatmapData;
  const _values = values?.map((row) => {
    return {
      ...row,
      x: Math.floor((row.x * MAP_BG_HEIGHT) / originFloorPlanHeight),
      y: Math.floor((row.y * MAP_BG_HEIGHT) / originFloorPlanHeight),
    };
  });

  heatmap.setData({
    max,
    data: _values || [],
  });
}

function WaitingTimeHeatmap({
  heatmapData,
  floorPlanInfo,
  zones,
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

  if (heatmapData && mapBgRef.current && heatmap === null) {
    const _heatmap = h337.create({
      container: mapBgRef.current,
      gradient: {
        '.1': 'rgba(255, 215, 4, 0.71)',
        '.3': 'rgba(255, 201, 63, 0.53)',
        '.6': 'rgba(255, 161, 19, 0.74)',
        '.8': 'rgba(255, 93, 42, 0.69)',
      },
    });
    setHeatmap(_heatmap);
  }

  if (heatmap !== null) {
    generateHeatmap({
      heatmap,
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
              <span>Least time spent</span>
              <span>Most time spent</span>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

WaitingTimeHeatmap.propTypes = {
  heatmapData: PropTypes.shape({}),
  zones: PropTypes.arrayOf(PropTypes.shape({})),
  floorPlanInfo: PropTypes.shape({
    img: PropTypes.string,
    pxPerMeter: PropTypes.number,
  }),
  selectedZoneId: PropTypes.number,
  loading: PropTypes.bool,
};
WaitingTimeHeatmap.defaultProps = {
  heatmapData: { max: 0, values: [] },
  zones: [],
  floorPlanInfo: {
    img: '',
    pxPerMeter: 0,
  },
  selectedZoneId: -1,
  loading: false,
};

export default React.memo(WaitingTimeHeatmap);
