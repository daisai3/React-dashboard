import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import Input from '../../shared/custom-input';
import Avatar from '../../shared/avatar';
import centerService from '../../../services/center.service';
import classes from './profile-card.module.scss';
import { typesOfContracts } from '../../../utils';

function formatRole(role) {
  if (!role) return '';
  return role
    .split('-')
    .map((row) => row.charAt(0).toUpperCase() + row.slice(1))
    .join(' ');
}

function ProfileCard({ data, onSave }) {
  const [profile, setProfile] = useState({});
  const [options, setOptions] = useState({
    centers: [],
    designated_zone_name: [],
    working_hours: [],
  });

  useEffect(() => {
    setProfile(data);
  }, [data]);

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
  const onChangeProfile = (event) => {
    const {
      target: { name, value },
    } = event;

    setProfile({ ...profile, [name]: value });
  };

  const onChangeImg = (src) => {
    const event = {
      target: {
        name: 'photo',
        value: src,
      },
    };
    onChangeProfile(event);
  };

  const onSaveProfile = () => {
    onSave(profile);
  };

  return (
    <div className={classes.mainWrapper}>
      <div className={classes.content}>
        <div className={classes.left}>
          <div className={classes.avatar}>
            <Avatar
              image={profile.photo}
              changeHandler={onChangeImg}
              editable
            />
          </div>
          <div className={cx(classes.name, 'text-normal')}>{profile.name}</div>
          <div className={cx(classes.role, 'text-normal')}>
            {formatRole(profile.role)}
          </div>
          <div className={cx(classes.email, 'text-small')}>{profile.email}</div>
          <div className={cx(classes.phone, 'text-small')}>{profile.phone}</div>
        </div>
        <div className={classes.right}>
          <div className={classes.inputsWrapper}>
            <div className="text-normal">
              <FormattedMessage
                id="settings_dashboard__profile_inputs_title"
                defaultMessage="Edit profile"
              />
            </div>
            <div className={cx(classes.inputs, 'text-normal')}>
              <div className={classes.input}>
                <Input
                  label="Name"
                  value={profile.name || ''}
                  name="name"
                  placeholder="Elissa"
                  onChange={onChangeProfile}
                  autoComplete="off"
                />
              </div>
              <div className={classes.input}>
                <Input
                  label="Job title"
                  value={profile.job_title || ''}
                  name="job_title"
                  placeholder="HX Officer"
                  onChange={onChangeProfile}
                  autoComplete="off"
                />
              </div>
              <div className={classes.input}>
                <Input
                  label="Phone"
                  value={profile.phone || ''}
                  name="phone"
                  placeholder="+34959959959"
                  onChange={onChangeProfile}
                  autoComplete="off"
                />
              </div>
              <div className={classes.input}>
                <Input
                  label="Gender"
                  value={profile.gender || ''}
                  name="gender"
                  placeholder="Female"
                  onChange={onChangeProfile}
                />
              </div>
              <div className={classes.input}>
                <Input
                  label="E-mail address"
                  value={profile.email || ''}
                  autoComplete="off"
                  name="email"
                  placeholder="emendez@dewa.com"
                  onChange={onChangeProfile}
                  readOnly
                />
              </div>
              <div className={classes.input}>
                <Input
                  label="Role"
                  value={formatRole(profile.role)}
                  name="role"
                  placeholder="Center Manager"
                  onChange={onChangeProfile}
                  readOnly
                />
              </div>
              <div className={classes.input}>
                <Input
                  // type="select"
                  label="Center"
                  value={profile.center_name || ''}
                  name="center_name"
                  placeholder="Burj Al Nahar Dewa Center"
                  onChange={onChangeProfile}
                  readOnly
                  // data={options.centers}
                />
              </div>
              <div className={classes.input}>
                <Input
                  type="select"
                  label="Area Name"
                  value={profile.designated_zone_name || ''}
                  name="designated_zone_name"
                  placeholder="Entry Area"
                  onChange={onChangeProfile}
                  disabled={!profile.center_name}
                  data={options.designated_zone_name}
                />
              </div>
              <div className={classes.input}>
                <Input
                  type="select"
                  label="Working Hours"
                  value={profile.working_hours || ''}
                  name="working_hours"
                  placeholder="Fulltime"
                  onChange={onChangeProfile}
                  data={typesOfContracts}
                />
              </div>
            </div>
          </div>
          <div className={classes.btnWrapper}>
            <button
              type="button"
              className={cx(classes.saveBtn, 'text-normal')}
              onClick={onSaveProfile}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ProfileCard.propTypes = {
  data: PropTypes.shape({
    center_name: PropTypes.string,
    designated_zone_name: PropTypes.string,
    email: PropTypes.string,
    is_active: PropTypes.string,
    job_title: PropTypes.string,
    language: PropTypes.string,
    name: PropTypes.string,
    photo: PropTypes.string,
    working_hours: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func,
};

ProfileCard.defaultProps = {
  onSave: () => {},
};

export default React.memo(ProfileCard);
