import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import cx from 'classnames';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
// import CustomAlert from '../../../components/alerts/custom-alert';
import classes from './alerts.module.scss';
import EmptyLabel from '../../../components/shared/empty-label';

function AlertsBlock() {
  return (
    <BlockWrapper title="alerts_and_recomendations" to="happiness-experience">
      <div className={classes.contentWrapper}>
        <EmptyLabel msg="Hooray! No more alerts!" />
        {/* <CustomAlert
          type="Happiness Experience"
          time="5 mins"
          alertText="The Average Happiness Level in Center is lower than minimum threshold."
          recommendationText="Pay more attention to customers in center and be ready to attend their needs."
        />
        <CustomAlert
          type="Waiting time"
          time="2 hours"
          alertText="The average waiting time in center has exceeded 40% than yesterday"
          recommendationText="Send a employee to re-direct the flow of employees to different areas in the shop."
        />
        <CustomAlert
          type="Customers & Visitors"
          time="4 hours"
          alertText="The Average Happiness Level in Center is lower than minimum threshold."
          recommendationText="Pay more attention to customers in center and be ready to attend their needs."
        /> */}
      </div>
      <div className={classes.actionWrapper}>
        <Link data-testid="nav-link" to="/notifications">
          <button type="button" className={cx(classes.button, 'text-normal')}>
            See all alerts & recommendations
          </button>
        </Link>
      </div>
    </BlockWrapper>
  );
}

export default React.memo(AlertsBlock);
