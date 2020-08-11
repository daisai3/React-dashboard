import React from 'react';
import PropTypes from 'prop-types';
import rootReducer, { initialState } from './reducers';

export const Store = React.createContext();
const StoreContext = ({ children }) => {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);
  return <Store.Provider value={[state, dispatch]}>{children}</Store.Provider>;
};

StoreContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContext;
