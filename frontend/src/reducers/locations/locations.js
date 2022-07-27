import {
  FETCH_FRIENDS_LOCATION,
  FETCH_USER_LOCATIONS,
  CLEAR_USER_LOCATIONS
} from '../../constants/actionTypes';

const initialState = {
  friendLocations: [],
  userLocations: [],
};

export default function locationsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FRIENDS_LOCATION:
      return { ...state, friendLocations: action.payload };
    case FETCH_USER_LOCATIONS:
      return { ...state, userLocations: action.payload };
    case CLEAR_USER_LOCATIONS:
      return { ...state, userLocations: [] };
    default:
      return state;
  }
};