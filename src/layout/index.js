import React from 'react';
import PropTypes from 'prop-types';
import logo from '../assets/images/Dive_Logo_Black.png';

// import Header from './header';
// import Drawer from './drawer';
import Navbar from './navbar';
import './layout.scss';

function Layout({ children, location }) {
  if (location.pathname === '/login') {
    return <main>{children}</main>;
  }

  return (
    <>
      {/* <Header /> */}
      {/* <Drawer location={location} /> */}
      <Navbar location={location} />
      <div className="mainContainer">
        <>
          {children}
          <footer>
            Powered by
            <img src={logo} width="50" alt="Dive.tech" />
          </footer>
        </>
      </div>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default Layout;
