import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import classes from './line-chart.module.scss';
import { DARK_BLUE_PASTEL, WHITE } from '../../../utils';

function getChartData({ labels, values }) {
  return {
    labels,
    datasets: [
      {
        label: '',
        backgroundColor: 'transparent',
        borderColor: DARK_BLUE_PASTEL,
        borderWidth: '8',
        pointRadius: '0',
        pointHoverRadius: '8',
        pointHoverBackgroundColor: DARK_BLUE_PASTEL,
        pointHoverBorderColor: WHITE,
        pointHoverBorderWidth: '4',
        data: values,
      },
    ],
  };
}

const options = {
  scales: {
    xAxes: [
      {
        ticks: {
          display: true,
        },
        gridLines: {
          drawOnChartArea: false,
          drawBorder: false,
          tickMarkLength: 5,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          display: false,
          min: 0,
          max: 100,
          stepSize: 20,
        },
        gridLines: {
          drawBorder: false,
        },
      },
    ],
  },
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,
    mode: 'nearest',
    custom(tooltipModel) {
      // Tooltip Element
      let tooltipEl = document.getElementById('chartjs-tooltip');

      // Create element on first render
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = '<table></table>';
        document.body.appendChild(tooltipEl);
      }
      // Hide if no tooltip
      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
      }

      function getBody(bodyItem) {
        return bodyItem.lines;
      }
      // Set Text
      if (tooltipModel.body) {
        let innerHtml = '';
        const bodyLines = tooltipModel.body.map(getBody);
        bodyLines.forEach((body) => {
          innerHtml += body;
        });
        const tableRoot = tooltipEl.querySelector('table');
        tableRoot.innerHTML = innerHtml;

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        const topMargin = 35;
        const leftMargin = 10;
        tooltipEl.style.opacity = 1;
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = `${position.left +
          tooltipModel.caretX -
          leftMargin}px`;
        tooltipEl.style.top = `${position.top +
          tooltipModel.caretY -
          topMargin}px`;
        tooltipEl.style.color = DARK_BLUE_PASTEL;
        tooltipEl.style.fontFamily = 'Lato';
        tooltipEl.style.fontSize = '14px';
        tooltipEl.style.fontStyle = 'normal';
        tooltipEl.style.fontWeight = '900';
        // tooltipEl.style.pointerEvents = 'none';
      }
    },
  },
  maintainAspectRatio: false,
};

function LineChart({ labels, values }) {
  const data = getChartData({ labels, values });

  return (
    <div className={classes.mainContainer}>
      <Line data={data} options={options} />
    </div>
  );
}

LineChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string),
  values: PropTypes.arrayOf(PropTypes.number),
};
LineChart.defaultProps = {
  labels: [],
  values: [],
};

export default React.memo(LineChart);
