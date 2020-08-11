import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import classes from './floorplan-areas.module.scss';

const DEFAULT_SELECTED_ZONE_ID = -1;

function getZonePoints({ zone, height, originHeight }) {
  const { polygon } = zone;
  let points = [];
  if (polygon) {
    polygon.map((coord, index) => {
      const px = (coord[0] / originHeight) * height;
      const py = (coord[1] / originHeight) * height;
      points = [...points, px];
      points = [...points, py];
      return coord;
    });
  }

  return { points };
}

function FloorPlanAreas({
  height,
  originWidth,
  originHeight,
  zones,
  type,
  selectedZoneId,
}) {
  const width = (height * originWidth) / originHeight;

  return (
    <div className={classes.bgWrapper} style={{ width, height }}>
      <div className={classes.content}>
        {zones.map((zone) => {
          const fillType = selectedZoneId > 0 ? 'selected' : type;
          const isVisible =
            selectedZoneId === DEFAULT_SELECTED_ZONE_ID ||
            zone.id === selectedZoneId;
          const { points } = getZonePoints({
            zone,
            height,
            originHeight,
          });
          return (
            <div
              key={zone.id}
              className={cx(
                classes.zone,
                classes[`zone-${zone.area_type}--${fillType}`],
              )}
            >
              {isVisible && (
                <svg height="100%" width="100%">
                  <polygon key={zone.id} points={points} />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

FloorPlanAreas.propTypes = {
  height: PropTypes.number,
  originWidth: PropTypes.number,
  originHeight: PropTypes.number,
  zones: PropTypes.arrayOf(PropTypes.shape({})),
  type: PropTypes.string,
  isText: PropTypes.bool,
  selectedZoneId: PropTypes.number,
};

FloorPlanAreas.defaultProps = {
  height: 500,
  originWidth: 4500,
  originHeight: 4500,
  zones: [],
  type: 'border',
  isText: false,
  selectedZoneId: -1,
};

export default React.memo(FloorPlanAreas);
