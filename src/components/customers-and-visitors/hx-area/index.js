import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import SectionWrapper from '../../shared/wrappers/section-wrapper';
import EmptyLabel from '../../shared/empty-label';
import Spinner from '../../shared/spinner';
import classes from './hx-area.module.scss';

function HxArea({ data, activeBtnId, setActiveBtnId, loading }) {
  const onClickBtn = (id) => {
    setActiveBtnId(activeBtnId !== id ? id : -1);
  };

  return (
    <div className={classes.mainContainer}>
      <SectionWrapper>
        <div className={classes.titleWrapper}>
          <span className={cx(classes.title, 'text-normal')}>
            <FormattedMessage
              id="customer_dashboard__insight_hx_area_title"
              defaultMessage="People counting by area"
            />
          </span>
        </div>
        {loading ? (
          <div className={cx(classes.spinnerContainer, 'Spinner_contained')}>
            <Spinner />
          </div>
        ) : (
          <div className={classes.content}>
            {data.length === 0 && <EmptyLabel />}
            {data.length > 0 && (
              <div className={classes.buttons}>
                {data.map((row) => {
                  let btnStatus = activeBtnId > -1 ? 'btn-inactive' : '';
                  if (activeBtnId === row.id) btnStatus = 'btn-active';
                  return (
                    <button
                      type="button"
                      key={row.id}
                      className={cx(
                        classes[`btn-${row.area_type.toLowerCase()}`],
                        classes[btnStatus],
                      )}
                      onClick={() => onClickBtn(row.id)}
                    >
                      <span className={cx('text-smaller')}>
                        {row.area_name}
                      </span>
                      <span className={cx('text-smaller')}>{row.clients}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}

HxArea.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape),
  activeBtnId: PropTypes.number,
  setActiveBtnId: PropTypes.func,
  loading: PropTypes.bool,
};

HxArea.defaultProps = {
  data: [],
  activeBtnId: -1,
  setActiveBtnId: () => {},
  loading: false,
};

export default React.memo(HxArea);
