import React, { useContext } from 'react';
import { Router, Location, Redirect } from '@reach/router';
import Login from '../pages/login';
import AuthGuard from './shared/auth-guard';
import Layout from '../layout';
import { Store } from '../store';
import OfficerHomeDashboard from '../pages/officer-home-dashboard';
// import CenterDashboard from '../pages/center-dashboard';
import HomeDashboard from '../pages/home-dashboard';
import HappinessExperienceDashboard from '../pages/hx-dashboard';
import CustomerDashboard from '../pages/customer-dashboard';
import WaitingTimeDashboard from '../pages/waiting-time-dashboard';
import JourneyDashboard from '../pages/journey-dashboard';
import EmployeeDashboard from '../pages/employee-dashboard';
import SettingsDashboard from '../pages/settings-dashboard';
import CameraConfigDashboard from '../pages/camera-config-dashboard';
import Register from '../pages/register';
import config from '../config';

function Routing() {
  const [store] = useContext(Store);

  function renderApp() {
    switch (store.user?.role) {
      case config.roles.EMPLOYEE:
        return (
          <>
            <AuthGuard path="/" Component={OfficerHomeDashboard} />
            <AuthGuard
              path="/happiness-experience"
              Component={HappinessExperienceDashboard}
            />
            <AuthGuard path="/waiting-time" Component={WaitingTimeDashboard} />
            <AuthGuard path="/customers" Component={CustomerDashboard} />
            <AuthGuard path="/journey" Component={JourneyDashboard} />
            <AuthGuard path="/settings" Component={SettingsDashboard} />
          </>
        );
      case config.roles.LOCAL:
      case config.roles.GLOBAL:
        return (
          <>
            <AuthGuard path="/" Component={HomeDashboard} />
            {/* <AuthGuard path="/" Component={HappinessExperienceDashboard} /> */}
            {/* <AuthGuard path="/" Component={CustomerDashboard} /> */}
            {/* <AuthGuard path="/" Component={WaitingTimeDashboard} /> */}
            {/* <AuthGuard path="/" Component={JourneyDashboard} /> */}
            {/* <AuthGuard path="/" Component={EmployeeDashboard} /> */}
            {/* <AuthGuard path="/" Component={SettingsDashboard} /> */}
            {/* <AuthGuard path="/" Component={OfficerDashboard} /> */}
            {/* <AuthGuard path="/" Component={CenterDashboard} /> */}
            {/* <AuthGuard path="/" Component={CameraConfigDashboard} /> */}
            <AuthGuard
              path="/happiness-experience"
              Component={HappinessExperienceDashboard}
            />
            <AuthGuard path="/customers" Component={CustomerDashboard} />
            <AuthGuard path="/waiting-time" Component={WaitingTimeDashboard} />
            <AuthGuard path="/journey" Component={JourneyDashboard} />
            <AuthGuard path="/employees" Component={EmployeeDashboard} />
            <AuthGuard path="/settings" Component={SettingsDashboard} />
            <AuthGuard path="/register" Component={Register} />

            <AuthGuard
              path="/camera-config"
              Component={CameraConfigDashboard}
            />
          </>
        );
      default:
        return <Redirect from="*" to="/login" noThrow />;
    }
  }
  return (
    <Location>
      {({ location }) => (
        <Layout location={location}>
          <Router location={location} primary={false}>
            <Login path="/login" />
            {renderApp()}
          </Router>
        </Layout>
      )}
    </Location>
  );
}

export default Routing;
