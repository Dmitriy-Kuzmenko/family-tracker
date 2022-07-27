import * as types from '../constants/actionTypes';
import api from '../api/api';

// auth
export const setLoginData = (token, userId) => ({ type: types.LOGIN, payload: { token, userId } });
export const logout = () => ({ type: types.LOGOUT });

export const register = (email, username, password) => async (dispatch) => {
  try {
    await api.post('/auth/registration', { email, username, password });
    await dispatch(login(username, password));
  } catch (e) {
    console.log('register', e);
  }
}

export const login = (username, password) => async (dispatch) => {
  try {
    const res = await api.post('/auth/login', { username, password });
    await dispatch(setLoginData(res.data.token, res.data.userId));
  } catch (e) {
    console.log(e);
  }
}


// users
export const setUsersLoading = () => ({ type: types.FETCH_USERS_LOADING });
export const setUsers = (data) => ({ type: types.FETCH_USERS, payload: data });

export const fetchUsersAction = () => async (dispatch) => {
  try {
    await dispatch(setUsersLoading());
    const res = await api.get(`/user/list`);
    await dispatch(setUsers(res.data));
  } catch (e) {
    console.log(e);
  }
}

export const addFriendAction = (friendId) => async (dispatch) => {
  try {
    await api.post('/user/add', { friendId });
    await dispatch(fetchUsersAction());
    await dispatch(fetchFriendsLocationAction());
  } catch (e) {
    console.log(e);
  }
}

export const deleteFriendAction = (userId) => async (dispatch) => {
  try {
    await api.delete(`/user/delete/${userId}`);
    await dispatch(fetchUsersAction());
    await dispatch(fetchFriendsLocationAction());
  } catch (e) {
    console.log(e);
  }
}

// locations
export const setFriendsLocations = (data) => ({ type: types.FETCH_FRIENDS_LOCATION, payload: data });

export const fetchFriendsLocationAction = () => async (dispatch) => {
  try {
    const res = await api.get(`/user/getFriendsLocation`);
    await dispatch(setFriendsLocations(res.data));
  } catch (e) {
    console.log('fetchFriendsLocationAction', e);
  }
}

export const addUserLocationAction = (latitude, longitude, address) => async (dispatch) => {
  try {
    await api.post('/location/add', { latitude, longitude, address });
  } catch (e) {
    console.log('addUserLocationAction', e);
  }
}

export const updateLocationAction = (latitude, longitude, address) => async (dispatch) => {
  try {
    await api.post('/user/updateLocation', { latitude, longitude, address });
  } catch (e) {
    console.log('updateLocationAction', e);
  }
}

export const setUserLocations = (data) => ({ type: types.FETCH_USER_LOCATIONS, payload: data });
export const clearUserLocations = (data) => ({ type: types.CLEAR_USER_LOCATIONS });

export const fetchUserLocationAction = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/location/list/${userId}`);
    await dispatch(setUserLocations(res.data));
  } catch (e) {
    console.log('fetchUserLocationAction', e);
  }
}