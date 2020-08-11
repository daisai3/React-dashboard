import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import cx from 'classnames';
import Icon from '../svgIcon';
import { MEDIUM_ICON_WIDTH } from '../../../utils';
import classes from './dropdown.module.scss';

function Dropdown({ index, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onOpenDropdown = () => {
    setIsExpanded(true);
  };

  const onCloseDropdown = () => {
    setIsExpanded(false);
  };

  const onClickEdit = () => {
    onEdit({ index });
    onCloseDropdown();
  };

  const onClickDelete = () => {
    onDelete({ index });
    onCloseDropdown();
  };

  return (
    <ClickAwayListener onClickAway={onCloseDropdown}>
      <div className={classes.dropdownWrapper}>
        <button type="button" onClick={onOpenDropdown}>
          <Icon name="moreOptions" />
        </button>
        {isExpanded && (
          <div className={cx(classes.dropdown)}>
            <div className={classes.row}>
              <button
                type="button"
                className={cx(classes.btn, classes.editBtn, 'text-small')}
                onClick={onClickEdit}
              >
                <div className={classes.iconWrapper}>
                  <Icon name="pencil" width={MEDIUM_ICON_WIDTH} />
                </div>
                <span>Edit</span>
              </button>
            </div>
            <div className={classes.row}>
              <button
                type="button"
                className={cx(classes.btn, classes.deleteBtn, 'text-small')}
                onClick={onClickDelete}
              >
                <div className={classes.iconWrapper}>
                  <Icon name="trash" width={MEDIUM_ICON_WIDTH} />
                </div>
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}

Dropdown.propTypes = {
  index: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

Dropdown.defaultProps = {
  index: 0,
  onEdit: () => {},
  onDelete: () => {},
};

export default Dropdown;
