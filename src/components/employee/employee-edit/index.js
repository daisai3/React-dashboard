import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import Icon from '../../shared/svgIcon';
import Modal from '../../shared/modal';
import Input from '../../shared/custom-input';
import Avatar from '../../shared/avatar';
import classes from './employee-edit.module.scss';
import centerService from '../../../services/center.service';
import { typesOfContracts } from '../../../utils';
import config from '../../../config';
import { Store } from '../../../store';

function formatRole(role) {
  if (!role) return '';
  return role
    .split('-')
    .map((row) => row.charAt(0).toUpperCase() + row.slice(1))
    .join(' ');
}

const roles = {
  'center-manager': 'Center Manager',
  'general-manager': 'General Manager',
  officer: 'Officer',
};

function getPermittedRoles(role) {
  if (role === config.roles.LOCAL) {
    const rolesCopy = { ...roles };
    delete rolesCopy['general-manager'];
    return rolesCopy;
  }
  return roles;
}

function EmployeeEdit({ data, onClose, onChange, onSave }) {
  const type = data.id === -1 ? 'Add' : 'Edit';
  const [store] = useContext(Store);
  const [options, setOptions] = useState({
    centers: [],
    designated_zone_name: [],
    working_hours: [],
  });

  useEffect(() => {
    const promises = [
      centerService.getCentersName(),
      data.center_name
        ? centerService.getZonesName(data.center_name)
        : Promise.resolve([]),
    ];

    Promise.all(promises).then((response) => {
      const [centers, zones] = response;
      setOptions((opt) => ({
        ...opt,
        centers: centers.data,
        designated_zone_name: zones.data || [],
      }));
    });
  }, [data.center_name]);

  const onChangeImg = (src) => {
    const event = {
      target: {
        name: 'photo',
        value: src,
      },
    };
    onChange(event);
  };

  return (
    <Modal className={classes.employeeModel}>
      <div className={classes.mainWrapper}>
        <div className={classes.header}>
          <div className={cx(classes.title, 'text-large')}>
            <FormattedMessage
              id="employee_dashboard__employee_edit_title"
              defaultMessage="My Profile"
            />
          </div>
          <button type="button" className={classes.closeBtn} onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className={classes.content}>
          <div className={classes.left}>
            <div className={classes.avatar}>
              <Avatar image={data.photo} changeHandler={onChangeImg} editable />
            </div>
            <div className={cx(classes.name, 'text-normal')}>
              {data.name || 'Elissa Méndez Orduña'}
            </div>
            <div className={cx(classes.role, 'text-normal')}>
              {formatRole(data.role)}
            </div>
            <div className={cx(classes.role, 'text-normal')}>{data.phone}</div>
          </div>
          <div className={classes.right}>
            <div className={classes.inputsWrapper}>
              <div className="text-normal">{`${type} Employee`}</div>
              <div className={cx(classes.inputs, 'text-normal')}>
                <div className={classes.input}>
                  <Input
                    label="Name"
                    value={data.name || ''}
                    name="name"
                    placeholder="Elissa"
                    onChange={onChange}
                    autoComplete="off"
                  />
                </div>
                <div className={classes.input}>
                  <Input
                    label="Job title"
                    value={data.job_title || ''}
                    name="job_title"
                    placeholder="HX Officer"
                    onChange={onChange}
                    autoComplete="off"
                  />
                </div>
                <div className={classes.input}>
                  <Input
                    label="Phone"
                    value={data.phone || ''}
                    name="phone"
                    placeholder="+34959959959"
                    onChange={onChange}
                    autoComplete="off"
                  />
                </div>
                <div className={classes.input}>
                  <Input
                    label="Gender"
                    value={data.gender || ''}
                    name="gender"
                    placeholder="Female"
                    onChange={onChange}
                  />
                </div>
                <div className={classes.input}>
                  <Input
                    label="E-mail address"
                    value={data.email || ''}
                    autoComplete="off"
                    name="email"
                    placeholder="emendez@dewa.com"
                    onChange={onChange}
                    readOnly={type === 'Edit'}
                  />
                </div>
                {type === 'Add' && (
                  <>
                    <div className={classes.input}>
                      <Input
                        autoComplete="off"
                        label="Password"
                        value={data.password || ''}
                        name="password"
                        placeholder="Insert password"
                        type="password"
                        onChange={onChange}
                        readOnly={type === 'Edit'}
                      />
                    </div>
                  </>
                )}
                <div className={classes.input}>
                  <Input
                    type="select"
                    label="Role"
                    value={data.role || 'general-manager'}
                    name="role"
                    placeholder="Center Manager"
                    onChange={onChange}
                    data={getPermittedRoles(store.user.role)}
                  />
                </div>
                <div className={classes.input}>
                  <Input
                    type="select"
                    label="Center"
                    value={data.center_name || ''}
                    name="center_name"
                    placeholder="Burj Al Nahar Dewa Center"
                    onChange={onChange}
                    readOnly={type === 'Edit'}
                    data={options.centers}
                  />
                </div>
                <div className={classes.input}>
                  <Input
                    type="select"
                    label="Area Name"
                    value={data.designated_zone_name || ''}
                    name="designated_zone_name"
                    placeholder="Entry Area"
                    onChange={onChange}
                    disabled={!data.center_name}
                    data={options.designated_zone_name}
                  />
                </div>
                <div className={classes.input}>
                  <Input
                    type="select"
                    label="Working Hours"
                    value={data.working_hours || ''}
                    name="working_hours"
                    placeholder="Fulltime"
                    onChange={onChange}
                    data={typesOfContracts}
                  />
                </div>
              </div>
            </div>
            <div className={classes.btnWrapper}>
              <button
                type="button"
                className={cx(classes.saveBtn, 'text-normal')}
                onClick={onSave}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

EmployeeEdit.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    center_name: PropTypes.string,
    designated_zone_name: PropTypes.string,
    email: PropTypes.string,
    is_active: PropTypes.string,
    job_title: PropTypes.string,
    language: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
    photo: PropTypes.string,
    working_hours: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
};

EmployeeEdit.defaultProps = {
  onClose: () => {},
  onChange: () => {},
  onSave: () => {},
};

export default React.memo(EmployeeEdit);
