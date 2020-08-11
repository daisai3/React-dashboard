import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import sha256 from 'crypto-js/sha256';
import userService from '../../services/user.service';
import centerService from '../../services/center.service';
import classes from './register.module.scss';
import validate from './validate';
import config from '../../config';

function Register() {
  const [form, setForm] = useState({
    name: { value: '', touched: false },
    job_title: { value: '', touched: false },
    email: { value: '', touched: false },
    password: { value: '', touched: false },
    role: { value: '', touched: false },
    center_name: { value: '', touched: false },
    designated_zone_name: { value: '', touched: false },
    working_hours: { value: '', touched: false },
  });

  const [errors, setErrors] = useState({
    nameErr: '',
    job_titleErr: '',
    emailErr: '',
    passwordErr: '',
    roleErr: '',
    center_nameErr: '',
    designated_zone_nameErr: '',
    working_hoursErr: '',
  });

  const [disabled, setDisabled] = useState(true);

  const [options, setOptions] = useState({
    centers: [],
    designated_zone_name: [],
    working_hours: [],
  });

  useEffect(() => {
    const promises = [
      centerService.getCentersName(),
      form.center_name.value
        ? centerService.getZonesName(form.center_name.value)
        : Promise.resolve([]),
      userService.getWorkingHours(),
    ];

    Promise.all(promises).then((response) => {
      const [centers, zones, working_hours] = response;
      setOptions((opt) => ({
        ...opt,
        centers: centers.data,
        designated_zone_name: zones.data || [],
        working_hours: working_hours.data,
      }));
    });
  }, [form.center_name]);

  useEffect(() => {
    setErrors((errorForm) => validate(form, errorForm));
  }, [form]);

  useEffect(() => {
    const allTouched = Object.values(form).every((item) => item.touched);
    const allClean = Object.values(errors).every((item) => item === '');
    setDisabled(!(allTouched && allClean));
  }, [form, errors]);

  function formHandler(event) {
    event.preventDefault();
    const body = {
      name: form.name.value,
      job_title: form.job_title.value,
      email: form.email.value,
      hashed_pass: sha256(form.password.value + config.salt).toString(),
      role: form.role.value,
      center_name: form.center_name.value,
      designated_zone_name: form.designated_zone_name.value,
      working_hours: form.working_hours.value,
    };
    userService.register(body);
  }
  return (
    <div className={classes.wrapperBox}>
      <h2 className={classes.pageTitle}>
        <FormattedMessage
          id="register__new_user_title"
          defaultMessage="New User Registration"
        />
      </h2>
      <form data-testid="register-page">
        <div className={classes.column}>
          <label htmlFor="name">
            <FormattedMessage id="name" defaultMessage="Name" />
            <input
              name="name"
              type="text"
              value={form.name.value}
              onFocus={() =>
                setForm({ ...form, name: { ...form.name, touched: true } })
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  name: { value: event.target.value, touched: true },
                })
              }
            />
            <small>{errors.nameErr && `* ${errors.nameErr}`}</small>
          </label>
          <label htmlFor="job_title">
            <FormattedMessage id="job_title" defaultMessage="Job title" />
            <input
              name="job_title"
              type="text"
              onFocus={() =>
                setForm({
                  ...form,
                  job_title: { ...form.job_title, touched: true },
                })
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  job_title: { value: event.target.value, touched: true },
                })
              }
            />
            <small>{errors.job_titleErr && `* ${errors.job_titleErr}`}</small>
          </label>
          <label htmlFor="email">
            <FormattedMessage id="email" defaultMessage="Email" />
            <input
              name="email"
              type="email"
              onFocus={() =>
                setForm({ ...form, email: { ...form.email, touched: true } })
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  email: { value: event.target.value, touched: true },
                })
              }
            />
            <small>{errors.emailErr && `* ${errors.emailErr}`}</small>
          </label>
          <label htmlFor="password">
            <FormattedMessage id="password" defaultMessage="Password" />
            <input
              name="password"
              type="password"
              onFocus={() =>
                setForm({
                  ...form,
                  password: { ...form.password, touched: true },
                })
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  password: { value: event.target.value, touched: true },
                })
              }
            />
            <small>{errors.passwordErr && `* ${errors.passwordErr}`}</small>
          </label>
        </div>

        <div className={classes.column}>
          <label htmlFor="role">
            <FormattedMessage id="role" defaultMessage="Role" />
            <select
              name="role"
              type="text"
              onFocus={() =>
                setForm({ ...form, role: { ...form.role, touched: true } })
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  role: { value: event.target.value, touched: true },
                })
              }
              onBlur={(event) =>
                setForm({
                  ...form,
                  role: { value: event.target.value, touched: true },
                })
              }
            >
              <FormattedMessage id="select" defaultMessage="Select">
                {(message) => <option value="">{message}</option>}
              </FormattedMessage>
              <FormattedMessage
                id="form__general_manager"
                defaultMessage="General Manager"
              >
                {(message) => (
                  <option value={config.roles.GLOBAL}>{message}</option>
                )}
              </FormattedMessage>
              <FormattedMessage
                id="form__center_manager"
                defaultMessage="Center Manager"
              >
                {(message) => (
                  <option value={config.roles.LOCAL}>{message}</option>
                )}
              </FormattedMessage>
              <FormattedMessage id="form__officer" defaultMessage="Officer">
                {(message) => (
                  <option value={config.roles.EMPLOYEE}>{message}</option>
                )}
              </FormattedMessage>
            </select>
            <small>{errors.roleErr && `* ${errors.roleErr}`}</small>
          </label>

          <label htmlFor="center_name">
            <FormattedMessage id="center_name" defaultMessage="Center Name" />
            <select
              name="center_name"
              type="text"
              value={form.center_name.value}
              onFocus={() =>
                setForm({
                  ...form,
                  center_name: { ...form.center_name, touched: true },
                })
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  center_name: { value: event.target.value, touched: true },
                })
              }
              onBlur={(event) =>
                setForm({
                  ...form,
                  center_name: { value: event.target.value, touched: true },
                })
              }
            >
              <FormattedMessage id="select" defaultMessage="Select">
                {(message) => <option value="">{message}</option>}
              </FormattedMessage>
              {options.centers.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            <small>
              {errors.center_nameErr && `* ${errors.center_nameErr}`}
            </small>
          </label>

          <label htmlFor="designated_zone_name">
            <FormattedMessage
              id="designated_zone_name"
              defaultMessage="Designated Zone"
            />
            <select
              disabled={!form.center_name.value}
              name="designated_zone_name"
              type="text"
              value={form.designated_zone_name.value}
              onFocus={() =>
                setForm({
                  ...form,
                  designated_zone_name: {
                    ...form.designated_zone_name,
                    touched: true,
                  },
                })
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  designated_zone_name: {
                    value: event.target.value,
                    touched: true,
                  },
                })
              }
              onBlur={(event) =>
                setForm({
                  ...form,
                  designated_zone_name: {
                    value: event.target.value,
                    touched: true,
                  },
                })
              }
            >
              <FormattedMessage id="select" defaultMessage="Select">
                {(message) => <option value="">{message}</option>}
              </FormattedMessage>
              {options.designated_zone_name.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            <small>
              {errors.designated_zone_nameErr &&
                `* ${errors.designated_zone_nameErr}`}
            </small>
          </label>

          <label htmlFor="working_hours">
            <FormattedMessage
              id="working_hours"
              defaultMessage="Working hours"
            />
            <select
              name="working_hours"
              type="text"
              value={form.working_hours.value}
              onFocus={() =>
                setForm({
                  ...form,
                  working_hours: {
                    ...form.working_hours,
                    touched: true,
                  },
                })
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  working_hours: {
                    value: event.target.value,
                    touched: true,
                  },
                })
              }
              onBlur={(event) =>
                setForm({
                  ...form,
                  working_hours: {
                    value: event.target.value,
                    touched: true,
                  },
                })
              }
            >
              <FormattedMessage id="select" defaultMessage="Select">
                {(message) => <option value="">{message}</option>}
              </FormattedMessage>
              {options.working_hours.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            <small>
              {errors.working_hoursErr && `* ${errors.working_hoursErr}`}
            </small>
          </label>
        </div>
      </form>
      <button
        type="button"
        className={`Global_btn ${
          disabled ? 'Global_btn_disabled' : 'Global_btn_green'
        } Global_align_left`}
        disabled={disabled}
        onClick={formHandler}
      >
        <FormattedMessage id="submit" defaultMessage="Submit" />
      </button>
    </div>
  );
}

export default Register;
