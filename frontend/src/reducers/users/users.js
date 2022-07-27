import {
  FETCH_USERS,
  FETCH_USERS_LOADING
} from '../../constants/actionTypes';

const initialState = {
  users: [],
  isLoading: false
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS:
      return { ...state, users: action.payload, isLoading: false };
    case FETCH_USERS_LOADING:
      return { ...state, isLoading: true };
    default:
      return state;
  }
};