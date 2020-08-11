import React from 'react';
import PropTypes from 'prop-types';
import classes from './stage-indicator.module.scss';
import { range, scss } from '../../../utils';

function StageIndicator({ stage, setStage, numberOfStages }) {
  const lastIndex = numberOfStages - 1;

  return (
    <div className={classes.mainWrapper}>
      {range(numberOfStages).map((i) => {
        if (i === lastIndex) {
          return (
            <div
              key={Math.random()}
              className={scss(classes.circle, stage >= i ? classes.active : '')}
            />
          );
        }
        return (
          <React.Fragment key={Math.random()}>
            <button
              type="button"
              onClick={() => {
                if (i <= stage) {
                  setStage(i);
                }
              }}
              className={scss(classes.circle, stage >= i ? classes.active : '')}
            />
            <div
              className={scss(classes.bar, stage >= i ? classes.active : '')}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

StageIndicator.propTypes = {
  stage: PropTypes.number,
  setStage: PropTypes.func,
  numberOfStages: PropTypes.number,
};

export default StageIndicator;
