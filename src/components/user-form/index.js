import React, { useContext, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Store } from '../../store/index';
import { storeUser } from '../../store/actions/auth';
import userService from '../../services/user.service';
import centerService from '../../services/center.service';
import Avatar from '../shared/avatar';
import Input from '../shared/input';
import { scss } from '../../utils';
import classes from './user-form.module.scss';

function UserForm() {
  const [store, dispatch] = useContext(Store);
  const [form, setForm] = useState({
    center_name: store.user?.center_name || '',
    designated_zone_name: store.user?.designated_zone_name || '',
    working_hours: store.user?.working_hours || '',
    is_active: store.user?.is_active || '',
    language: store.user?.language || '',
  });
  const [options, setOptions] = useState({
    centers: [],
    designated_zone_name: [],
    working_hours: [],
    statusType: [],
    language: [],
  });

  useEffect(() => {
    setForm({
      center_name: store.user?.center_name || '',
      designated_zone_name: store.user?.designated_zone_name || '',
      working_hours: store.user?.working_hours || '',
      is_active: store.user?.is_active || '',
      language: store.user?.language || '',
    });
  }, [store.user]);

  useEffect(() => {
    const promises = [
      centerService.getCentersName(),
      centerService.getZonesName(form.center_name),
      userService.getWorkingHours(),
      userService.getStatusTypes(),
      userService.getAllLanguages(),
    ];

    Promise.all(promises).then((response) => {
      const [centers, zones, working_hours, statusType, language] = response;
      setOptions((opt) => ({
        ...opt,
        centers: centers.data,
        designated_zone_name: zones.data,
        working_hours: working_hours.data,
        statusType: statusType.data,
        language: language.data,
      }));
    });
  }, [form.center_name]);

  function handleImageChange(blob) {
    const updatedUser = { ...store.user, photo: blob };
    dispatch(storeUser(updatedUser));
    userService.updateUser(updatedUser);
  }

  function handleFormChange(event, field) {
    const updatedForm = { ...form, [field]: event.target.value };
    setForm(updatedForm);
    const updatedUser = { ...store.user, [field]: event.target.value };
    dispatch(storeUser(updatedUser));
    userService.updateUser(updatedUser);
  }

  return (
    <>
      <div className={scss(classes.avatarWrapper)} data-testid="form-input">
        <Avatar
          image={store.user?.photo}
          editable
          changeHandler={handleImageChange}
        />
        <p>{store.user?.name}</p>
        <p>{store.user?.job_title}</p>
      </div>
      <p className={classes.formTitle}>
        <strong>
          <FormattedMessage
            id="user_form__profile_title"
            defaultMessage="Profile"
          />
        </strong>
      </p>
      <Input
        label={
          <FormattedMessage
            id="user_form__office_label"
            defaultMessage="Office"
          />
        }
        value={form.center_name}
        options={options.centers}
        readOnly
        data-testid="form-input"
        onChange={(event) => {
          handleFormChange(event, 'center_name');
        }}
      />
      <Input
        label={
          <FormattedMessage id="user_form__desk_label" defaultMessage="Desk" />
        }
        value={form.designated_zone_name}
        options={options.designated_zone_name}
        data-testid="form-input"
        onChange={(event) => {
          handleFormChange(event, 'designated_zone_name');
        }}
      />
      <Input
        label={
          <FormattedMessage
            id="user_form__working_hours_label"
            defaultMessage="Expected Working Hours"
          />
        }
        value={form.working_hours}
        options={options.working_hours}
        data-testid="form-input"
        onChange={(event) => {
          handleFormChange(event, 'working_hours');
        }}
      />
      <Input
        label={
          <FormattedMessage
            id="user_form__status_label"
            defaultMessage="Status"
          />
        }
        value={form.is_active}
        options={options.statusType}
        data-testid="form-input"
        onChange={(event) => {
          handleFormChange(event, 'is_active');
        }}
      />
      {/* <p className={classes.formTitle}>
        <strong>
          <FormattedMessage
            id="user_form__personalize_title"
            defaultMessage="Personalize"
          />
        </strong>
      </p>
      <Input
        label={
          <FormattedMessage
            id="user_form__language_label"
            defaultMessage="Language"
          />
        }
        value={form.language}
        options={options.language}
        data-testid="form-input"
        onChange={(event) => {
          handleFormChange(event, 'language');
        }}
      /> */}
    </>
  );
}

export default React.memo(UserForm);
