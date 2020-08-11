import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classes from './bar-chart-group.module.scss';
import { BarChart } from '../shared/data-chart';

function BarChartGroup({ customers }) {
  const genderDatasetParent = useRef();
  const ethnicityDatasetParent = useRef();

  const byGenderDataset = {
    Male: 0,
    Female: 0,
  };
  const byEthnicityDataset = {
    Local: 0,
    Nonlocal: 0,
  };
  const byAgeDataset = {
    '0-18': 0,
    '19-49': 0,
    '50+': 0,
  };
  customers.forEach((customer) => {
    byAgeDataset[customer.age_range] += 1;
    byEthnicityDataset[customer.ethnicity] += 1;
    byGenderDataset[customer.gender] += 1;
  });

  return (
    <div className={classes.groupWrapper}>
      <div className={classes.chartContainer}>
        <p>
          <FormattedMessage
            id="bar_chart__by_gender"
            defaultMessage="By Gender"
          />
        </p>
        <div
          className={classes.barBox}
          data-testid="barchart-wrapper"
          ref={genderDatasetParent}
        >
          <BarChart
            name="Gender"
            width={genderDatasetParent.current?.getBoundingClientRect().width}
            height={genderDatasetParent.current?.getBoundingClientRect().height}
            data={byGenderDataset}
          />
        </div>
      </div>
      {/* <div className={classes.chartContainer}>
        <p>
          <FormattedMessage
            id="bar_chart__by_age_range"
            defaultMessage="By Age Range"
          />
        </p>
        <div
          className={classes.barBox}
          data-testid="barchart-wrapper"
          ref={ageDatasetParent}
        >
          <BarChart
            name="Age"
            width={ageDatasetParent.current?.getBoundingClientRect().width}
            height={ageDatasetParent.current?.getBoundingClientRect().height}
            data={byAgeDataset}
          />
        </div>
      </div> */}
      <div className={classes.chartContainer}>
        <p>
          <FormattedMessage
            id="bar_chart__by_ethnicity"
            defaultMessage="By Ethnicity"
          />
        </p>
        <div
          className={classes.barBox}
          data-testid="barchart-wrapper"
          ref={ethnicityDatasetParent}
        >
          <BarChart
            name="Ethnicity"
            width={
              ethnicityDatasetParent.current?.getBoundingClientRect().width
            }
            height={
              ethnicityDatasetParent.current?.getBoundingClientRect().height
            }
            data={byEthnicityDataset}
          />
        </div>
      </div>
    </div>
  );
}

BarChartGroup.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      age_range: PropTypes.string,
      center_name: PropTypes.string,
      epoch_second: PropTypes.number,
      ethnicity: PropTypes.string,
      gender: PropTypes.string,
      global_identity: PropTypes.string,
      happiness_index: PropTypes.number,
      area: PropTypes.string,
      position_x: PropTypes.number,
      position_y: PropTypes.number,
    }),
  ),
};

export default BarChartGroup;
