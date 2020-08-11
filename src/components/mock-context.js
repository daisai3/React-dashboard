import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import translations from '../locales';
import { Store } from '../store/index';
import rootReducer from '../store/reducers';

const language = 'en';

const MockContext = ({ initialState = {}, children }) => {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);
  return (
    <IntlProvider
      locale={language}
      defaultLocale="en"
      messages={translations[language]}
    >
      <Store.Provider value={[state, dispatch]}>{children}</Store.Provider>
    </IntlProvider>
  );
};

MockContext.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  initialState: PropTypes.objectOf(PropTypes.any),
};

export { MockContext };
