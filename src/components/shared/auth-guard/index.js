import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from '@reach/router';
import { Store } from '../../../store';

function AuthGuard({ Component, ...args }) {
  const [store] = React.useContext(Store);
  if (!store.user?.role) {
    return <Redirect to="/login" noThrow />;
  }
  return <Component {...args} />;
}

AuthGuard.propTypes = {
  Component: PropTypes.func.isRequired,
};

export default AuthGuard;
