import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import FloorPlanBackground from '../../shared/map-floorplan/floorplan-background';
import FloorPlanAreas from '../../shared/map-floorplan/floorplan-areas';
import classes from './journey.module.scss';

const MAP_BG_HEIGHT = 248;

function HxArea({ data, floorPlanInfo, zones }) {
  const [activeBtnId, setActiveBtnId] = useState(-1);
  const [originFloorPlanImg, setOriginFloorPlanImg] = useState(null);
  const [originFloorPlanHeight, setOriginFloorPlanHeight] = useState(
    MAP_BG_HEIGHT,
  );
  const [originFloorPlanWidth, setOriginFloorPlanWidth] = useState(
    MAP_BG_HEIGHT,
  );
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

  const onClickBtn = (id) => {
    setActiveBtnId(activeBtnId !== id ? id : -1);
  };

  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.content}>
          <div className={classes.map}>
            <FloorPlanBackground
              src={floorPlanInfo.img}
              height={MAP_BG_HEIGHT}
            />
            <FloorPlanAreas
              height={MAP_BG_HEIGHT}
              originWidth={originFloorPlanWidth}
              originHeight={originFloorPlanHeight}
              zones={zones}
              type="selected"
              selectedZoneId={activeBtnId}
            />
          </div>
          <div className={classes.buttons}>
            {data.map((row) => {
              let btnStatus = activeBtnId > -1 ? 'btn-inactive' : '';
              if (activeBtnId === row.id) btnStatus = 'btn-active';
              return (
                <button
                  type="button"
                  key={row.id}
                  className={cx(
                    classes[`btn-${row.area_type}`],
                    classes[btnStatus],
                  )}
                  onClick={() => onClickBtn(row.id)}
                >
                  <span className={cx('text-smaller')}>{row.area_name}</span>
                  <span className={cx('text-smaller')}>
                    {row.happiness_avg > 0 ? row.happiness_avg : '--'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

HxArea.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape),
  floorPlanInfo: PropTypes.shape({
    img: PropTypes.string,
    pxPerMeter: PropTypes.number,
  }),
  zones: PropTypes.arrayOf(PropTypes.shape({})),
};

HxArea.defaultProps = {
  data: [],
  floorPlanInfo: {
    img: '',
    pxPerMeter: 0,
  },
  zones: [],
};

export default React.memo(HxArea);
