import React from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import classes from './pie-chart.module.scss';
import { LIGHT_BLUE_PASTEL, DARK_BLUE_PASTEL } from '../../../utils';

function getDataForDonut(percent1, percent2) {
  const data = {
    labels: ['female', 'male'],
    datasets: [
      {
        label: '',
        backgroundColor: [LIGHT_BLUE_PASTEL, DARK_BLUE_PASTEL],
        data: [percent1, percent2],
      },
    ],
  };
  const options = {
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
    maintainAspectRatio: false,
  };
  return { data, options };
}

function PieChart({ percent1, percent2 }) {
  const { data, options } = getDataForDonut(percent1, percent2);
  return (
    <Pie
      className={classes.pieChart}
      height={64}
      width={64}
      data={data}
      options={options}
    />
  );
}

PieChart.propTypes = {
  percent1: PropTypes.number,
  percent2: PropTypes.number,
};

PieChart.defaultProps = {
  percent1: 70,
  percent2: 30,
};

export default React.memo(PieChart);
