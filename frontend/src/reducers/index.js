import { combineReducers } from 'redux';

import authReducer from './auth/auth';
import usersReducer from './users/users';
import locationsReducer from './locations/locations';

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  locations: locationsReducer,
});

export default rootReducer;