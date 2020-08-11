import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import Icon from '../../shared/svgIcon';
import {
  NORMAL_ICON_WIDTH,
  SMALL_ICON_WIDTH,
  formatTime,
} from '../../../utils';
import classes from './customer-detail.module.scss';

dayjs.extend(utc);

const WAIT_SHORT_TIME = 120;
const WAIT_LONG_TIME = 300;

function getCustomerStatus(customer) {
  let status = '';

  const { dwell_time: dwellTime } = customer;
  if (dwellTime < WAIT_SHORT_TIME) status = 'new';
  if (dwellTime >= WAIT_SHORT_TIME && dwellTime <= WAIT_LONG_TIME)
    status = 'wait-short';
  if (dwellTime > WAIT_LONG_TIME) status = 'wait-long';
  return status;
}

function CustomerDetail({ data }) {
  const status = getCustomerStatus(data);
  return (
    <div className={classes.customerDetail}>
      <SectionWrapper>
        <div className={classes.customerDetailHeader}>
          <div className={classes.customerDetailIconWrapper}>
            <div className={classes.icon}>
              <Icon name={data.icon} width={NORMAL_ICON_WIDTH} />
            </div>
            <div className={cx(classes.status, classes[`status-${status}`])}>
              <Icon name="singleEllipse" width={SMALL_ICON_WIDTH} />
            </div>
          </div>
          <div className={cx(classes.customerDetailHeaderInfo, 'text-small')}>
            <div
              className={classes.customerAreaType}
            >{`Customer ${data.area_type || ''}`}</div>
            <div>
              <span
                className={classes.customerId}
              >{`ID: ${data.global_identity || ''}`}</span>
            </div>
          </div>
        </div>
        <div className={cx(classes.customerDetailContent, 'text-small')}>
          <div className={classes.customerDetailRow}>
            <span className={classes.field}>
              <FormattedMessage
                id="detailed_customer_dashboard__status_time_in_center"
                defaultMessage="Time in center:"
              />
            </span>
            <span className={classes.value}>{`${formatTime(
              data.dwell_time,
            )} in center`}</span>
          </div>

          <div className={classes.customerDetailRow}>
            <span className={classes.field}>
              <FormattedMessage
                id="detailed_customer_dashboard__status_mask"
                defaultMessage="Wearing Mask:"
              />
            </span>
            <span className={classes.value}>
              {data.mask === 'Mask' ? 'Yes' : 'No'}
            </span>
          </div>
          <div className={classes.customerDetailRow}>
            <span className={classes.field}>
              <FormattedMessage
                id="detailed_customer_dashboard__status_aggregated_hx"
                defaultMessage="Aggregate HX:"
              />
            </span>
            <span className={classes.value}>{data.happiness_index || ''}</span>
          </div>
        </div>
        {/* <div className={classes.customerDetailFooter}>
          <input placeholder="Add comment..." className="text-small" />
        </div> */}
      </SectionWrapper>
    </div>
  );
}

CustomerDetail.propTypes = {
  data: PropTypes.shape(),
};
CustomerDetail.defaultProps = {
  data: {},
};

export default React.memo(CustomerDetail);
