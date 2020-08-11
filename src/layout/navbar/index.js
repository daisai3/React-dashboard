/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import ReactTooltip from 'react-tooltip';
import cx from 'classnames';
import Icon from '../../components/shared/svgIcon';
import { logo, navbarList } from './constants';
import classes from './navbar.module.scss';
import { Store } from '../../store';

function Navbar({ location }) {
  const currentLocation = location?.pathname;
  const [store] = useContext(Store);

  return (
    <div className={classes.mainNavbar}>
      <div className={classes.logoWrapper}>
        <Link data-testid="nav-link" to="/">
          <img src={logo.img} alt={logo.alt} />
        </Link>
      </div>
      <div className={classes.itemsWrapper}>
        {navbarList[store.user?.role]?.map((item) => {
          return (
            <Link data-testid="nav-link" key={item.name} to={item.to}>
              <div className={classes.itemWrapper}>
                <div
                  className={cx(
                    classes.item,
                    currentLocation === item.to ? classes.itemActive : '',
                  )}
                >
                  {currentLocation === item.to && (
                    <div className={classes.backgroundWrapper}>
                      <Icon name={item.icon} />
                    </div>
                  )}
                  {currentLocation !== item.to && (
                    <div
                      className={classes.imgWrapper}
                      data-tip
                      data-for={item.icon}
                    >
                      <Icon name={item.icon} />
                      <ReactTooltip
                        id={item.icon}
                        className={classes.tooltip}
                        arrowColor="transparent"
                        place="right"
                        effect="solid"
                      >
                        <span className="text-small">{item.tooltip}</span>
                      </ReactTooltip>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

Navbar.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default React.memo(Navbar);
