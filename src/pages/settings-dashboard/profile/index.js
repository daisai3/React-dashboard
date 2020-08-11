import React, { useContext } from 'react';
import BlockWrapper from '../../../components/shared/wrappers/block-wrapper';
import ProfileCard from '../../../components/settings/profile-card';
import { Store } from '../../../store';
import userService from '../../../services/user.service';
import { storeUser } from '../../../store/actions/auth';
import classes from './profile.module.scss';

function Profile() {
  const [store, dispatch] = useContext(Store);
  const { user: profileData } = store;

  const onUpdateProfile = async (data) => {
    const { data: userResponse } = await userService.updateUser(data);
    dispatch(storeUser(userResponse));
  };

  return (
    <BlockWrapper title="settings_dashboard__profile_title">
      <div className={classes.mainWrapper} data-testid="home-manager-page">
        <ProfileCard data={profileData} onSave={onUpdateProfile} />
      </div>
    </BlockWrapper>
  );
}

export default Profile;
