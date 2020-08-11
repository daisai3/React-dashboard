/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import Icon from '../../components/shared/icon';
import { scss } from '../../utils';
import classes from './Drawer.module.scss';
import UserForm from '../../components/user-form';
import NavigationPanel from '../navigation-panel';
import userService from '../../services/user.service';

function Drawer({ location }) {
  const [isOpen, setOpen] = useState(false);

  function toggleDrawer() {
    setOpen(!isOpen);
  }

  return (
    <>
      <CSSTransition
        in={isOpen}
        unmountOnExit
        timeout={300}
        classNames="overlay"
      >
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          data-testid="drawer-overlay"
          className={classes.overlay}
          onClick={toggleDrawer}
        />
      </CSSTransition>
      <div className={scss(classes.container, !isOpen ? classes.closed : '')}>
        <div className={classes.wrapper}>
          <button
            data-testid="drawer-toggler"
            type="button"
            onClick={toggleDrawer}
            className={classes.toggleBtn}
          >
            <Icon name="ellipsis" />
          </button>
          <UserForm />
          <NavigationPanel location={location} />
          <button
            className="Global_btn"
            type="button"
            onClick={() => {
              userService.logout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

Drawer.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default React.memo(Drawer);
