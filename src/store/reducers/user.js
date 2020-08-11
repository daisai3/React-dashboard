import * as types from '../types';

export default function userReducer(state, action) {
  switch (action.type) {
    case types.USER_LOGIN:
      return action.payload;
    case types.STORE_USER:
      return action.payload;
    default:
      return state;
  }
}
