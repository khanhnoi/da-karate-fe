/* eslint-disable no-unused-vars */
import {
  postData,
  getTakenData,
  putDataWithUrl,
  putDataUrl
} from '../services/base_services';
import {
  LOGOUT_URL,
  LOGIN_URL,
  UPDATE_USER_URL,
  CHANGE_PASSWORD,
  LOGIN,
  GET_USER_URL
} from '../constants/config';
import { setToken, checkTokenExists } from '../helpers/auth';
import * as types from '../constants/action_type';
import { destructServerErrors } from '../helpers/error';
import { setLoading } from './loading';
import { showMessage } from '../helpers/table';

export const setDataUser = (user) => {
  return {
    type: types.SET_USER_DATA,
    user
  };
};

export const setAuthenticated = (authenticated) => {
  return {
    type: types.SET_AUTHENTICATED,
    authenticated
  };
};

export const clearAuth = () => (dispatch) => {
  setToken(null);
  dispatch(setDataUser(null));
  dispatch(setAuthenticated(false));
};

// GET USER INFO FROM TOKEN ACTION
const getUser = () => {
  return getTakenData(GET_USER_URL)
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};

export const initUserFromToken = () => (dispatch) => {
  dispatch(setLoading(true));
  checkTokenExists()
    .then((token) => {
      setToken(token);
      getUser()
        .then(async (res) => {
          const user = res.data;
          await dispatch(setDataUser(user));
          await dispatch(setAuthenticated(true));
          dispatch(setLoading(false));
        })
        .catch((error) => {
          if (error.response) {
            dispatch(clearAuth());
          }
          dispatch(setLoading(false));
        });
    })
    .catch((anyError) => {
      dispatch(setLoading(false));
    });
};

export const signInUser = (data) => (dispatch) => {
  return postData(LOGIN, data)
    .then(async (res) => {
      const user = res.data.profile;
      await setToken(res.data.token);
      await dispatch(setDataUser(user));
      await dispatch(setAuthenticated(true));
      return Promise.resolve({ res });
    })
    .catch((error) => Promise.reject(error));
};

export const signOutUser = () => (dispatch) => {
  return postData(LOGOUT_URL)
    .then((data) => {
      dispatch(clearAuth());
      Promise.resolve(data);
    })
    .catch((error) => Promise.reject(error));
};

const userFormRequest = (status) => {
  return {
    type: types.FORM_USER_REQUEST,
    status
  };
};

const updateUser = (data, status) => {
  return {
    type: types.EDIT_USER,
    data,
    status
  };
};

export const updateUserProfileRequest = (data) => (dispatch) => {
  dispatch(userFormRequest(true));
  return putDataUrl(UPDATE_USER_URL, data)
    .then((res) => {
      dispatch(updateUser(res.data, true));
      dispatch(userFormRequest(false));
      getUser()
        .then(async (res) => {
          const user = res.data;
          showMessage('Thông tin người dùng đã được cập nhật thành công.', true);
          dispatch(setDataUser(user));
        })
        .catch((error) => {});
      return Promise.resolve({ res });
    })
    .catch((error) => {
      const errs = destructServerErrors(error);
      dispatch(updateUser(errs, false));
      dispatch(userFormRequest(false));
      if (error.response.status == 422) {
        return null;
      }
      showMessage(errs.message, false);

      return Promise.reject(error);
    });
};


export const resetState = () => {
  return {
      type: types.RESET_USER
  }
}