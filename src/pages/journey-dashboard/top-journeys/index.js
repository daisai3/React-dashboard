import React, { useContext } from 'react';
import cx from 'classnames';
import CustomerJourney from '../../../components/journey/customer-journey';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import Spinner from '../../../components/shared/spinner';
import EmptyLabel from '../../../components/shared/empty-label';
import { Store } from '../../../store';
import { FIXED_CNT, TOTAL_PERCENTAGE } from '../../../utils';
import classes from './top-journeys.module.scss';

const JOURNEYS_LIMIT_CNT = 3;

const areaTypeToIconMapper = {
  Entry: 'entrance',
  Exit: 'entrance',
  Interaction: 'interaction',
  Waiting: 'waiting',
  Support: 'support',
};

function getCommonJourneys(centers) {
  let journeys = [];
  if (centers && centers.commonJourneys) {
    const _journeys = centers.commonJourneys;
    journeys = _journeys.map((row1, index1) => {
      const _journey = row1.journey.map((row2, index2) => {
        return {
          id: index2,
          name: row2.area_name,
          icon: areaTypeToIconMapper[row2.area_type],
        };
      });

      let { percent } = row1;
      if (!Number.isInteger(percent)) {
        percent = Number(percent.toFixed(FIXED_CNT));
      }

      return {
        id: index1,
        journey: _journey,
        percent: percent * TOTAL_PERCENTAGE,
      };
    });
    journeys = journeys.slice(0, JOURNEYS_LIMIT_CNT);
  }
  return journeys;
}

function TopJourneys() {
  const [store] = useContext(Store);
  const { centers, global } = store;
  const commonJourneys = getCommonJourneys(centers);
  const loading = global?.loading;
  const journeyLoading = loading?.commonJourney;

  return (
    <BlockWrapper title="journey_dashboard__top_journeys_title">
      {journeyLoading ? (
        <div className={cx(classes.spinnerContainer, 'Spinner_contained')}>
          <Spinner />
        </div>
      ) : (
        <div className={classes.mainWrapper}>
          {commonJourneys.length === 0 && (
            <div className={classes.emptyLabelContainer}>
              <EmptyLabel />
            </div>
          )}
          {commonJourneys.map((row, index) => {
            const journeyNum = `0${index + 1}`.slice(-1 * FIXED_CNT);
            return (
              <CustomerJourney
                key={row.id}
                title={`Journey ${journeyNum}`}
                data={row}
                border="blue"
              />
            );
          })}
        </div>
      )}
    </BlockWrapper>
  );
}

export default React.memo(TopJourneys);
