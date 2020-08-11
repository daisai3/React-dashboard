export default {
  api: {
    production: process.env.REACT_APP_API_URL || 'http://localhost',
    development: 'http://localhost',
  },
  salt: 'AzUqHrLsnGUh12NAs9an2A!2fnAadT',
  port: process.env.REACT_APP_API_PORT,
  companyName: 'Dubai Electricity and Water Authority',
  roles: {
    GLOBAL: 'general-manager',
    LOCAL: 'center-manager',
    EMPLOYEE: 'officer',
  },
};
