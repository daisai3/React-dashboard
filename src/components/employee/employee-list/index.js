import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import BlockWrapper from '../../shared/wrappers/block-wrapper';
import Dropdown from '../../shared/dropdown';
import Spinner from '../../shared/spinner';
import Icon from '../../shared/svgIcon';
import { headerColumns } from './data';
import tempAvatar from '../../../assets/images/temp-avatar2.jpg';
import { SMALL_ICON_WIDTH } from '../../../utils';
import classes from './employee-list.module.scss';

function formatRole(role) {
  if (!role) return '';
  return role
    .split('-')
    .map((row) => row.charAt(0).toUpperCase() + row.slice(1))
    .join(' ');
}

function EmployeeList({ data, onOpenEdit, onOpenDelete, loading }) {
  return (
    <BlockWrapper title="employee_dashboard__list_of_employees_title">
      <div className={classes.mainWrapper}>
        <table className="custom-table">
          <thead>
            <tr className={cx('row', 'header-row')}>
              {headerColumns.map((column) => {
                return (
                  <th className={cx(classes.column, 'column')} key={column.id}>
                    <span className={cx('blue-text', 'text-small')}>
                      {column.name}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td>
                  <div
                    className={cx(
                      classes.spinnerContainer,
                      'Spinner_contained',
                    )}
                  >
                    <Spinner />
                  </div>
                </td>
              </tr>
            ) : (
              data.map((employee) => (
                <tr className={cx('row', 'content-row')} key={employee.id}>
                  <td
                    className={cx(
                      classes.column,
                      classes.avatarColumn,
                      'column',
                    )}
                  >
                    <span>
                      <img src={employee.photo || tempAvatar} alt="avatar" />
                      <div
                        className={cx(
                          classes.avatarStatus,
                          classes[
                            `${
                              employee.is_active === 'Active'
                                ? 'avatarStatus__active'
                                : ''
                            }`
                          ],
                        )}
                      >
                        <Icon name="singleEllipse" width={SMALL_ICON_WIDTH} />
                      </div>
                    </span>
                  </td>
                  <td className={cx(classes.column, 'column')}>
                    <span className={cx('dark-black-text', 'text-small')}>
                      {employee.name}
                    </span>
                  </td>
                  <td className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {employee.email}
                    </span>
                  </td>
                  <td className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {employee.phone}
                    </span>
                  </td>
                  <td className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {employee.gender || 'Male'}
                    </span>
                  </td>
                  <td className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {employee.job_title}
                    </span>
                  </td>
                  <td className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {formatRole(employee.role)}
                    </span>
                  </td>
                  <td className={cx(classes.column, 'column')}>
                    <span className={cx('light-black-text', 'text-small')}>
                      {employee.is_active}
                    </span>
                  </td>
                  <td className={cx(classes.column, 'column')}>
                    <Dropdown
                      index={employee.id}
                      onEdit={onOpenEdit}
                      onDelete={onOpenDelete}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </BlockWrapper>
  );
}

EmployeeList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape),
  onOpenEdit: PropTypes.func,
  onOpenDelete: PropTypes.func,
  loading: PropTypes.bool,
};

EmployeeList.defaultProps = {
  data: [],
  onOpenEdit: () => {},
  onOpenDelete: () => {},
  loading: false,
};

export default React.memo(EmployeeList);
