import logoImg from '../../assets/images/navbar-logo-small.png';
import config from '../../config';

const logo = {
  img: logoImg,
  alt: 'logo',
};
const navbarList = {
  [config.roles.LOCAL]: [
    {
      name: 'home',
      to: '/',
      icon: 'home',
      tooltip: 'Home',
    },
    {
      name: 'HX',
      to: '/happiness-experience',
      icon: 'hx',
      tooltip: 'Happiness Experience',
    },
    {
      name: 'customers',
      to: '/customers',
      icon: 'customers',
      tooltip: 'Customers',
    },
    {
      name: 'waiting time',
      to: '/waiting-time',
      icon: 'waiting',
      tooltip: 'Waiting time',
    },
    {
      name: 'journey',
      to: '/journey',
      icon: 'journey',
      tooltip: 'Customer Journey',
    },
    {
      name: 'employees',
      to: '/employees',
      icon: 'employees',
      tooltip: 'Employees',
    },
    // {
    //   name: 'reports',
    //   to: '/reports',
    //   icon: 'reports',
    //   tooltip: 'Reports',
    // },
    // {
    //   name: 'mask',
    //   to: '/mask',
    //   icon: 'mask',
    //   tooltip: 'Mask',
    // },
    // {
    //   name: 'notifications',
    //   to: '/notifications',
    //   icon: 'notifications',
    //   tooltip: 'Notifications',
    // },
    {
      name: 'settings',
      to: '/settings',
      icon: 'settings',
      tooltip: 'Settings',
    },
  ],
  [config.roles.EMPLOYEE]: [
    {
      name: 'home',
      to: '/',
      icon: 'home',
      tooltip: 'Home',
    },
    {
      name: 'HX',
      to: '/happiness-experience',
      icon: 'hx',
      tooltip: 'Happiness Experience',
    },
    {
      name: 'customers',
      to: '/customers',
      icon: 'customers',
      tooltip: 'Customers',
    },
    {
      name: 'waiting time',
      to: '/waiting-time',
      icon: 'waiting',
      tooltip: 'Waiting time',
    },
    {
      name: 'journey',
      to: '/journey',
      icon: 'journey',
      tooltip: 'Customer Journey',
    },
    // {
    //   name: 'mask',
    //   to: '/mask',
    //   icon: 'mask',
    //   tooltip: 'Mask',
    // },
    // {
    //   name: 'notifications',
    //   to: '/notifications',
    //   icon: 'notifications',
    //   tooltip: 'Notifications',
    // },
    {
      name: 'settings',
      to: '/settings',
      icon: 'settings',
      tooltip: 'Settings',
    },
  ],
};

navbarList[config.roles.GLOBAL] = navbarList[config.roles.LOCAL];

export { logo, navbarList };
