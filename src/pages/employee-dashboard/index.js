import React, { useState, useEffect, useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import sha256 from 'crypto-js/sha256';
import cx from 'classnames';
import EmployeeList from '../../components/employee/employee-list';
import EmployeeEdit from '../../components/employee/employee-edit';
import centerService from '../../services/center.service';
import userService from '../../services/user.service';
import { FETCH_TABLE_MS, getRequestData } from '../../utils';
import { Store } from '../../store';
import config from '../../config';
import { storeCentersInfo, clearCenters } from '../../store/actions/centers';
import {
  storeActiveFilter,
  storeLoading,
  clearLoading,
} from '../../store/actions/global';
import classes from './employee-dashboard.module.scss';

function getEmployees(centers, role) {
  const employees = [];
  if (centers && centers.centerInfo) {
    const {
      centerInfo: { employee_list },
    } = centers;
    if (role === config.roles.GLOBAL) {
      return employee_list.map((row, index) => {
        return { ...row, id: index };
      });
    }
    if (role === config.roles.LOCAL) {
      return employee_list
        .filter((employee) => employee.role !== config.roles.GLOBAL)
        .map((row, index) => {
          return { ...row, id: index };
        });
    }
  }
  return employees;
}

function getCentersInfoLoading(global) {
  if (global) {
    if (global.loading) {
      const {
        loading: { centersInfo },
      } = global;
      return centersInfo;
    }
  }

  return false;
}

function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [employeeModalOpened, setEmployeeModalOpened] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [store, dispatch] = useContext(Store);
  const { user, timeline, centers, global } = store;
  const timelineRef = useRef();
  const centersRef = useRef();
  // const activeFilter = global ? global.filter.id : 0;
  const employees = getEmployees(centers, store.user.role);
  const centersInfoLoading = getCentersInfoLoading(global);
  const activeFilter = 0;
  const center = user.center_name;

  useEffect(() => {
    timelineRef.current = timeline;
    centersRef.current = centers;
  });

  useEffect(() => {
    dispatch(clearCenters());
    dispatch(clearLoading());
    dispatch(storeActiveFilter({ id: 0 }));
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (loading) return () => {};

    async function centersInfoFetch({ isInitial }) {
      if (isInitial) dispatch(storeLoading({ centersInfo: true }));
      const { fromTime, toTime } = getRequestData(activeFilter);
      const { data: newCentersInfo } = await centerService.getCenter(
        center,
        fromTime,
        toTime,
      );
      // const oldCentersInfo =
      //   centersRef.current && centersRef.current.centerInfo
      //     ? centersRef.current.centerInfo
      //     : {};
      // if (!isObjectsSame(oldCentersInfo, newCentersInfo)) {
      //   dispatch(storeCentersInfo(newCentersInfo));
      // }
      dispatch(storeCentersInfo(newCentersInfo));
      if (isInitial) dispatch(storeLoading({ centersInfo: false }));
    }

    centersInfoFetch({ isInitial: true });

    let refetchInterval = null;
    refetchInterval = setInterval(() => {
      centersInfoFetch({ isInitial: false });
    }, FETCH_TABLE_MS);

    return () => {
      clearInterval(refetchInterval);
    };
  }, [dispatch, loading, center, activeFilter]);

  const onOpenAddModal = () => {
    const defaultEmployee = {
      id: -1,
      center_name: '',
      designated_zone_name: '',
      email: '',
      is_active: '',
      job_title: '',
      language: '',
      name: '',
      photo: '',
      gender: '',
      phone: '',
      working_hours: '',
    };
    setSelectedEmployee(defaultEmployee);
    setEmployeeModalOpened(true);
  };

  const onOpenEditModal = ({ index }) => {
    setSelectedEmployee(employees[index]);
    setEmployeeModalOpened(true);
  };

  const onCloseModal = () => {
    setEmployeeModalOpened(false);
    setSelectedEmployee(null);
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setSelectedEmployee({ ...selectedEmployee, ...{ [name]: value } });
  };

  const onSave = async () => {
    const updatedData = { ...selectedEmployee };
    if (updatedData.id === -1) {
      updatedData.hashed_pass = sha256(
        updatedData.password + config.salt,
      ).toString();
      delete updatedData.password;
      delete updatedData.id;
      updatedData.is_active = 'Active';
      updatedData.language = 'en';
      await userService.register(updatedData);
    } else {
      await userService.updateUser(updatedData);
    }
    onCloseModal();
    setLoading(true);
    setLoading(false);
  };

  const onDelete = async ({ index }) => {
    const { center_name, email } = employees[index];
    await userService.deleteUser({
      center: center_name,
      email,
    });

    setLoading(true);
    setLoading(false);
  };

  return (
    <div className={classes.mainContainer} data-testid="home-manager-page">
      <div className="pg-title">
        <FormattedMessage
          id="employee_dashboard_title"
          defaultMessage="{center} Employees"
          values={{ center }}
        />
      </div>
      <div className={classes.content}>
        <div className={classes.addBtnWrapper}>
          <button
            type="button"
            className={cx(classes.btn, 'text-normal')}
            onClick={onOpenAddModal}
          >
            <FormattedMessage
              id="employee_dashboard__add_btn_text"
              defaultMessage="Add New Employee"
            />
          </button>
        </div>
        <div className={classes.employList}>
          <EmployeeList
            data={employees}
            onOpenEdit={onOpenEditModal}
            onOpenDelete={onDelete}
            loading={centersInfoLoading}
          />
        </div>
        {employeeModalOpened && (
          <EmployeeEdit
            data={selectedEmployee}
            onChange={onChange}
            onClose={onCloseModal}
            onSave={onSave}
          />
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
