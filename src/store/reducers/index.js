import userReducer from './user';
import timelineReducer from './timeline';
import centersReducer from './centers';
import globalReducer from './global';

export const initialState = {};

export default function rootReducer(state = initialState, action) {
  const { user, timeline, centers, global } = state;

  return {
    user: userReducer(user, action),
    timeline: timelineReducer(timeline, action),
    centers: centersReducer(centers, action),
    global: globalReducer(global, action),
  };
}
