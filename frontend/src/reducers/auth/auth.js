import {
  LOGIN,
  LOGOUT,
} from '../../constants/actionTypes';

const initialState = {
  isAuth: Boolean(localStorage.getItem('token')),
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userId', action.payload.userId);
      return { ...state, isAuth: true, token: action.payload.token, userId: action.payload.userId };
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      return { ...state, isAuth: false, token: null, userId: null };
    default:
      return state;
  }
};