import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { scss, FETCH_HEARTBEAT_MS } from '../../utils';
import classes from './customers-map.module.scss';
import Icon from '../shared/icon';

const ONE_HUNDRED_PERCENT = 100;
function CustomersMap({
  customers = [],
  selectedCustomer,
  setSelectedCustomer,
  map,
}) {
  const [zoomed, setZoom] = useState(1);
  const [imgOriginalSize, setImgOriginalSize] = useState([0, 0]);

  useEffect(() => {
    const tmpImg = new Image();
    tmpImg.onload = () => {
      setImgOriginalSize([tmpImg.width, tmpImg.height]);
    };
    tmpImg.src = map;
  }, [map]);

  function handleZoom(type) {
    const maxZooming = 3;
    let newZoom = zoomed;
    if (type === 'plus' && newZoom < maxZooming) {
      newZoom++;
    }

    if (type === 'minus' && newZoom > 1) {
      newZoom--;
    }
    setZoom(newZoom);
  }

  return (
    <>
      <div className={classes.zoomBtn}>
        <button type="button" onClick={() => handleZoom('plus')}>
          <Icon name="zoomIn" />
        </button>
        <button type="button" onClick={() => handleZoom('minus')}>
          <Icon name="zoomOut" />
        </button>
      </div>

      <div
        className={classes.mapWrapper}
        style={zoomed !== 1 ? { justifyContent: 'flex-start' } : {}}
      >
        <div
          style={
            zoomed !== 1
              ? {
                  margin: 0,
                  height: 'fit-content',
                  backgroundImage: `url(${map})`,
                  backgroundSize: 'contain',
                  transform: `scale(${zoomed})`,
                }
              : {
                  backgroundImage: `url(${map})`,
                  backgroundSize: 'contain',
                }
          }
          className={classes.mapImage}
          alt="Center's 2D map"
        >
          <img src={map} alt="Centers blueprint" width="250" height="250" />
          {imgOriginalSize && (
            <TransitionGroup>
              {customers.map((customer) => {
                return (
                  <CSSTransition
                    key={customer.global_identity}
                    timeout={1000}
                    classNames="customer_dot"
                  >
                    <button
                      data-testid="customer-dot"
                      type="button"
                      style={{
                        transition: `top ${FETCH_HEARTBEAT_MS}ms, left ${FETCH_HEARTBEAT_MS}ms`,
                        top: `calc(${(customer.position_y /
                          imgOriginalSize[1]) *
                          ONE_HUNDRED_PERCENT}% + 8px)`,
                        left: `calc(${(customer.position_x /
                          imgOriginalSize[0]) *
                          ONE_HUNDRED_PERCENT}% + 8px)`,
                      }}
                      className={scss(
                        classes.customerDot,
                        selectedCustomer?.global_identity ===
                          customer.global_identity
                          ? classes.selectedCustomer
                          : '',
                      )}
                      onClick={() => {
                        setSelectedCustomer(customer);
                      }}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          )}
        </div>
      </div>
    </>
  );
}

CustomersMap.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      center_name: PropTypes.string,
      epoch_second: PropTypes.number,
      global_identity: PropTypes.string,
      area: PropTypes.string,
      position_x: PropTypes.number,
      position_y: PropTypes.number,
    }),
  ).isRequired,
  setSelectedCustomer: PropTypes.func.isRequired,
  selectedCustomer: PropTypes.shape({
    center_name: PropTypes.string,
    epoch_second: PropTypes.number,
    global_identity: PropTypes.string,
    area: PropTypes.string,
    position_x: PropTypes.number,
    position_y: PropTypes.number,
  }),
  map: PropTypes.string,
};

export default CustomersMap;
