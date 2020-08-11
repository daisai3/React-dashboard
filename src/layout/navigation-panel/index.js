import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { Store } from '../../store';
import classes from './navigation-panel.module.scss';
import Icon from '../../components/shared/icon';
import { scss } from '../../utils';
import config from '../../config';

function NavigationPanel({ location }) {
  const [store] = useContext(Store);

  if (
    store.user?.role === config.roles.LOCAL ||
    store.user?.role === config.roles.GLOBAL
  ) {
    return (
      <div className={classes.navContainer}>
        <Link
          data-testid="nav-link"
          className={scss(
            classes.navBtn,
            location.pathname === '/' ? classes.active : '',
          )}
          to="/"
        >
          <Icon name="home" />
        </Link>
        <Link
          data-testid="nav-link"
          className={scss(
            classes.navBtn,
            location.pathname === '/customers' ? classes.active : '',
          )}
          to="/customers"
        >
          <Icon name="customers" />
        </Link>
        <Link
          data-testid="nav-link"
          className={scss(
            classes.navBtn,
            location.pathname === '/camera-config' ? classes.active : '',
          )}
          to="/camera-config"
        >
          <Icon name="config" />
        </Link>
        <Link
          data-testid="nav-link"
          className={scss(
            classes.navBtn,
            location.pathname === '/register' ? classes.active : '',
          )}
          to="/register"
        >
          <Icon name="employees" fillRule="evenodd" clipRule="evenodd" />
        </Link>
      </div>
    );
  }
  return null;
}

NavigationPanel.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default NavigationPanel;
