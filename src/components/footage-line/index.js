import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './footage-line.module.scss';
import timelineService from '../../services/timeline.service';
import { getStartOfTheDay } from '../../utils';

function FootageLine({ center, selectedCustomer }) {
  const [footage, setFootage] = useState();

  useEffect(() => {
    const from_time = getStartOfTheDay();
    timelineService
      .getFootageTimeline({ center, customer: selectedCustomer, from_time })
      .then((faceFootage) => {
        setFootage(faceFootage.data);
      });
  }, [selectedCustomer, center]);

  return (
    <div className={classes.footageWrapper}>
      {footage &&
        footage.map((crop) => (
          <img key={Math.random()} src={crop} alt="face crop" />
        ))}
    </div>
  );
}

FootageLine.propTypes = {
  center: PropTypes.string,
  selectedCustomer: PropTypes.string.isRequired,
};

export default React.memo(FootageLine);
