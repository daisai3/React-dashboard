import React from 'react';
import PropTypes from 'prop-types';

import { range, scss } from '../../../utils';
import Icon from '../../shared/icon';
import classes from '../journey-stages.module.scss';

const iconMap = {
  entry: 'home',
  waiting: 'sofa',
  sitting: 'sofa',
  speaking: 'chatting',
  walking: 'alone',
};

function Stage({ name, stages, indexesToFill }) {
  function renderIcon(stageName) {
    return (
      <div className={classes.iconWrapper}>
        <Icon
          name={iconMap[stageName?.toLowerCase()] || 'example'}
          fillRule="evenodd"
          clipRule="evenodd"
        />
        <p>{stageName}</p>
      </div>
    );
  }
  function renderBar(indexes) {
    const indexesArr = Object.keys(indexes);
    return (
      <div className={classes.barWrapper}>
        {range(stages).map((index) => (
          <div
            key={index}
            className={scss(
              classes.stageBlock,
              indexes[index] ? classes.filledInBlock : classes.notSelectedBlock,
              indexesArr.indexOf(String(index)) === 0 ? classes.firstChild : '',
              index === stages - 1 ? classes.lastChild : '',
            )}
          />
        ))}
      </div>
    );
  }
  const objectKeys = Object.keys(indexesToFill);
  if (objectKeys.length === 1) {
    return (
      <div className={classes.stageWrapper} data-testid="stage">
        {renderIcon(objectKeys[0])}
        {renderBar(indexesToFill[objectKeys[0]])}
      </div>
    );
  }

  return (
    <div className={classes.barGroup}>
      <div className={classes.stageWrapper} data-testid="stage">
        {renderIcon(name)}
        {renderBar(
          Object.keys(indexesToFill).reduce((acc, curr) => {
            return { ...acc, ...indexesToFill[curr] };
          }, {}),
        )}
      </div>
      {Object.keys(indexesToFill).map((indexesMap) => (
        <div
          key={indexesMap}
          className={scss(classes.stageWrapper, classes.innerStage)}
        >
          {renderIcon(indexesMap)}
          {renderBar(indexesToFill[indexesMap])}
        </div>
      ))}
    </div>
  );
}

Stage.propTypes = {
  name: PropTypes.string,
  stages: PropTypes.number.isRequired,
  indexesToFill: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Stage;
