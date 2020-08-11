import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import Spinner from '../../../components/shared/spinner';
import Icon from '../../../components/shared/svgIcon';
import { Store } from '../../../store';
import {
  NAV_ICON_WIDTH,
  MILLISECONDS_PER_SECOND,
  formatTime,
} from '../../../utils';
import { headerColumns } from './data';
import classes from './customer-list.module.scss';

function getShortAreaName(name) {
  if (name) {
    const _array = name.split(' ');
    if (_array.length > 0) return _array[0].toLowerCase();
  }
  return 'cdm';
}

function getCustomers(centers) {
  const customers = [];
  if (centers && centers.customers) {
    const {
      customers: { customers: _customers },
    } = centers;
    return _customers.map((customer, index) => {
      const { id, date, gender, highlight_on_customers_areas } = customer;
      const _actions = highlight_on_customers_areas
        .filter((row) => row.value)
        .map((area, areaIdx) => {
          return { id: areaIdx, name: getShortAreaName(area.area_name) };
        });
      return {
        ...customer,
        id: index,
        uniqueId: id,
        date: date ? date.split('.').join('/') : '',
        actions: _actions,
        icon: gender ? gender.toLowerCase() : 'male',
      };
    });
  }
  return customers;
}

function getCenterCustomers(centers) {
  const customerList = [];
  if (centers && centers.centerInfo) {
    const {
      centerInfo: { customer_list: _customerList },
    } = centers;
    return _customerList.map((customer) => {
      const { gender } = customer;
      return {
        ...customer,
        icon: gender ? gender.toLowerCase() : 'male',
      };
    });
  }
  return customerList;
}

const LoadingSpinner = () => (
  <div className={cx(classes.spinnerContainer, 'Spinner_contained')}>
    <Spinner />
  </div>
);

function CustomerList({
  currentPage,
  totalPage,
  onSelectCustomer,
  onFetchNewCustomers,
}) {
  const [store] = useContext(Store);
  const { centers, global } = store;
  const customers = getCustomers(centers);
  const centerCustomers = getCenterCustomers(centers);
  const loading = global?.loading;
  const centersCustomersLoading = loading?.centersCustomers;
  const hasMore = currentPage !== totalPage - 1;

  const onClickRow = (data) => {
    const selectedCustomer = centerCustomers.filter(
      (row) => row.global_identity === data.uniqueId,
    );
    if (selectedCustomer.length > 0) {
      onSelectCustomer(selectedCustomer[0]);
    }
  };

  const fetchMoreData = () => {
    if (!hasMore) return;
    onFetchNewCustomers();
  };

  return (
    <BlockWrapper title="customer_dashboard__list_of_customers_title">
      <div className={classes.mainWrapper}>
        <div className="custom-table">
          <div className={cx('row', 'header-row')}>
            {headerColumns.map((column) => {
              return (
                <div className={cx(classes.column, 'column')} key={column.id}>
                  <span className={cx('blue-text', 'text-small')}>
                    {column.name}
                  </span>
                </div>
              );
            })}
          </div>
          {centersCustomersLoading && <LoadingSpinner />}
          {!centersCustomersLoading && (
            <InfiniteScroll
              className={classes.infiniteScrollContainer}
              dataLength={customers.length}
              next={fetchMoreData}
              height={600}
              hasMore={hasMore}
              loader={customers.length > 0 && <LoadingSpinner />}
            >
              {customers.map((customer) => (
                <div className={cx('row', 'content-row')} key={customer.id}>
                  <div className={cx(classes.column, 'column')}>
                    <span className={cx('dark-black-text', 'text-small')}>
                      {customer.uniqueId}
                    </span>
                  </div>
                  <div className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {dayjs(
                        customer.epoch_second * MILLISECONDS_PER_SECOND,
                      ).format('DD.MM.YY')}
                    </span>
                  </div>
                  <div className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {formatTime(customer.dwell_time)}
                    </span>
                  </div>
                  <div className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {customer.gender}
                    </span>
                  </div>
                  <div className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {customer.ethnicity}
                    </span>
                  </div>
                  <div className={cx(classes.column, 'column')}>
                    <span
                      className={cx(
                        'light-black-text',
                        'text-small',
                        classes.actionCell,
                      )}
                    >
                      {customer.actions.map((action, actionId) => (
                        <div
                          className={cx(
                            classes.action,
                            classes[`action-${action.name}`],
                          )}
                          key={actionId}
                        >
                          <Icon name={action.name} width={NAV_ICON_WIDTH} />
                        </div>
                      ))}
                    </span>
                  </div>
                  <div className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {`${customer.happiness}/100`}
                    </span>
                  </div>
                  <div className={cx(classes.column, 'column')}>
                    <button
                      type="button"
                      className={cx('green-text', 'text-small')}
                      onClick={() => onClickRow(customer)}
                    >
                      <FormattedMessage
                        id="see_details"
                        defaultMessage="See details"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
}

CustomerList.propTypes = {
  currentPage: PropTypes.number,
  totalPage: PropTypes.number,
  onSelectCustomer: PropTypes.func,
  onFetchNewCustomers: PropTypes.func,
};

CustomerList.defaultProps = {
  currentPage: 0,
  totalPage: -1,
  onSelectCustomer: () => {},
  onFetchNewCustomers: () => {},
};

export default React.memo(CustomerList);
